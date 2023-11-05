#!/usr/bin/env node
import axios from 'axios';
import fs from 'fs';
import https from 'https';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import path from 'path';
import cheerio from 'cheerio';

const argv = yargs(hideBin(process.argv))
  .option('url', {
    alias: 'u',
    type: 'string',
    description: 'Url of the video in the format https://share.zight.com/[ID]'
  })
  .option('list', {
    alias: 'l',
    type: 'string',
    description: 'Filename of the text file containing the list of URLs'
  })
  .option('prefix', {
    alias: 'p',
    type: 'string',
    description: 'Prefix for the output filenames when downloading from a list'
  })
  .option('out', {
    alias: 'o',
    type: 'string',
    description: 'Path to output the file to or directory to output files when using --list'
  })
  .option('defaultTitle', {
    alias: 'd',
    type: 'boolean',
    default: false,
    description: 'Use the page title as the default video title if available'
  })
  .option('timeout', {
    alias: 't',
    type: 'number',
    description: 'Timeout in milliseconds to wait between downloads when using --list'
  })
  .check((argv) => {
    if (!argv.url && !argv.list) {
      throw new Error('Please provide either a single video URL with --url or a list of URLs with --list to proceed');
    }
    if (argv.url && argv.list) {
      throw new Error('Please provide either --url or --list, not both');
    }
    if (argv.timeout && argv.timeout < 0) {
      throw new Error('Please provide a non-negative number for --timeout');
    }
    return true;
  })
  .help()
  .alias('help', 'h')
  .argv;


const fetchDownloadUrl = async (pageUrl, useDefaultTitle) => {
  try {
    const response = await axios.get(pageUrl);
    const pageData = response.data;

    const $ = cheerio.load(pageData);
    const twitterImageValue = $('meta[name="twitter:image"]').attr('value');
    const videoTitle = $('meta[property="og:title"]').attr('content');
    const firstSplit = twitterImageValue.split('.gif/');
    if (firstSplit.length < 2) {
      throw new Error('Video not found');
    }

    const secondSplit = firstSplit[1].split('?source');
    if (secondSplit.length === 0) {
      throw new Error('Video not found');
    }

    const mp4Url = `https://${secondSplit[0]}`;
    if (useDefaultTitle && videoTitle) {
      return { title: videoTitle, mp4Url };
    } else {
      return { mp4Url };
    }
  } catch (error) {
    throw error;
  }
};

const downloadVideo = (url, filename) => {
  console.log(`Downloading video from ${url}`);
  const file = fs.createWriteStream(filename);
  https.get(url, function(response) {
    response.pipe(file);
  });
};

const extractId = (url) => {
  url = url.split('?')[0];
  return url.split('/').pop();
};

const delay = (duration) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

const downloadFromList = async () => {
  const filePath = path.resolve(argv.list);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const urls = fileContent.split(/\r?\n/);
  const outputDirectory = argv.out || '.';
  const useDefaultTitle = argv.defaultTitle;

  for (let i = 0; i < urls.length; i++) {
    if (urls[i].trim()) {
      const id = extractId(urls[i]);
      const urlInfo = await fetchDownloadUrl(urls[i], useDefaultTitle);
      let filename;
      if (argv.prefix) {
        filename = path.join(outputDirectory, `${argv.prefix}-${i + 1}.mp4`);
      } else {
        filename = path.join(outputDirectory, useDefaultTitle && urlInfo.title ? `${urlInfo.title}.mp4` : `${id}.mp4`);
      }
      console.log(`Downloading video ${useDefaultTitle && urlInfo.title ? urlInfo.title : id} and saving to ${filename}`);
      downloadVideo(urlInfo.mp4Url, filename);
      if (argv.timeout) {
        console.log(`Waiting for ${argv.timeout} milliseconds before the next download...`);
        await delay(argv.timeout);
      }
    }
  }
};

const downloadSingleFile = async () => {
  const id = extractId(argv.url);
  const urlInfo = await fetchDownloadUrl(argv.url, argv.defaultTitle);
  const filename = argv.out || (argv.defaultTitle && urlInfo.title ? `${urlInfo.title}.mp4` : `${id}.mp4`);
  console.log(`Downloading video ${argv.defaultTitle && urlInfo.title ? urlInfo.title : id} and saving to ${filename}`);
  downloadVideo(urlInfo.mp4Url, filename);
};

const main = async () => {
  if (argv.list) {
    await downloadFromList().catch(error => {
      console.error(error.message);
    });
  } else if (argv.url) {
    await downloadSingleFile().catch(error => {
      console.error(error.message);
    });
  }
};

main();

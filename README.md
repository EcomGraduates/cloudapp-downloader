---
# CloudApp/Zight Video Downloader

CloudApp/Zight Video Downloader is a simple Node.js command-line tool to download videos from cloudapp.com/zight.com. It retrieves the video download link based on the video ID in the URL and saves the video with a specified filename, a prefix for multiple files, or by default, the video ID.

## Getting Started

To run this tool, you need to have Node.js and npm installed on your machine.

### Installation

1. Clone the repo: `git clone https://github.com/EcomGraduates/cloudapp-downloader.git`
2. Install NPM packages: `npm install`

### Dependencies

This tool uses the following npm packages:

- `axios` - Promise based HTTP client for the browser and Node.js.
- `cheerio` - Fast, flexible & lean implementation of core jQuery designed specifically for the server.
- `fs` - File system module to work with the file system on your computer.
- `https` - HTTPS module to make native HTTPS requests.
- `path` - Path module provides utilities for working with file and directory paths.
- `yargs` - Yargs helps you build interactive command line tools, by parsing arguments and generating an elegant user interface.

## Usage

### Download a Single Video

To download a single video from cloudapp.com/zight.com, run the following command, replacing `[VideoId]` with the actual video ID from the URL:



```
node cloudapp-dl.js --url https://share.getcloudapp.com/[VideoId]
```

This will download the video and save it as `[VideoId].mp4`.

You can specify a different output filename with the `--out` or `-o` option:

```
node cloudapp-dl.js --url https://share.getcloudapp.com/[VideoId] --out [FileName].mp4 or node cloudapp-dl.js --url https://share.getcloudapp.com/[VideoId] --out path/to/[FileName].mp4
```

This will download the video and save it as `[FileName].mp4`.

### Download Multiple Videos

To download multiple videos listed in a text file, use the `--list` option. Create a text file with one video URL per line and pass the file path to the script:

```
node cloudapp-dl.js --list path/to/urls.txt
```

By default, each video will be saved with its video ID as the filename.

You can specify a filename prefix with the `--prefix` option. The script will append an auto-incrementing number to each downloaded video:

```
node cloudapp-dl.js --list path/to/urls.txt --prefix download --out path/to/output
```

This will save the videos with the specified prefix "download" and an incremented number in the given output directory. download-1.mp4 download-2.mp4

### Avoid rate limiting

To prevent getting firewalled or rate-limited, a timeout can be set between downloads using the `--timeout` option:

```
node cloudapp-dl.js --list path/to/urls.txt --prefix download --out path/to/output --timeout 5000
```

This will add a 5-second wait time between each download. adjust as needed.

### installing via NPM

run npm install cloudapp-dl in terminal

```
npm i cloudapp-dl
```

### use command cloudapp-dl

follow the same commands as above but replace node cloudapp-dl.js with cloudapp-dl

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is open source and available under the [MIT License](https://choosealicense.com/licenses/mit/).

---

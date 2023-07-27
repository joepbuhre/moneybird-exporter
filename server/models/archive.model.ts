import archiver from 'archiver'
import fs from 'fs'
import { logger } from '../utils/logger';

export const archive = (output: any): archiver.Archiver => {
    // create a file to stream archive data to.
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function() {
        logger.debug(archive.pointer() + ' total bytes');
        logger.debug('archiver has been finalized and the output file descriptor has closed.');
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', function() {
        logger.debug('Data has been drained');
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function(err: any) {
    if (err.code === 'ENOENT') {
        // log warning
    } else {
        // throw error
        throw err;
    }
    });

    // good practice to catch this error explicitly
    archive.on('error', function(err: any) {
        throw err;
    });

    // pipe archive data to the file
    archive.pipe(output);

    return archive

}
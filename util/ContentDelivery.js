const fs = require('fs');

/**
 * @author zrthxn
 * 
 * Content Delivery Library
 * ------------------------
 * * Important *
 */

exports.Lookup = (fileId) => {
    /**
     * @author zrthxn
     * This function does the searching part and it has to be made fast
     * See the cdn folder for a clearer view of this
     * The file called cdnJookup.js is the lookup table
     * Inside that you'll see "$schema" and that sorta describes how data will eventually be stored
     */
    return new Promise((resolve,reject)=>{
        fs.readFile('./cdn/cdnLookup.json', (err, content)=>{
            if (err) reject('LOOKUP_ERROR', err);
            let lookupTable = JSON.parse(content);

            lookupTable.files.forEach(file => {
                // Better search algorithm needed here
                // This will take too much time and delay further requests
                if (file.__id === fileId) resolve(file.path, file.filename, file.contentType);
            });
        })
    });
}

exports.Upload = (fileId) => {
    /**
     * @author zrthxn
     * This is the upload file function
     * The sequence/pattern of file IDs has to be decided. If they are sequential it'll be easy to search
     * like for example they go : A0001, A0002 A0003...
     * 
     *  - Some hard rules for IDs
     *    -- should only be alphanumeric
     *    -- should be combination of upper and lowercase
     *    -- should be exactly 6 charecters (that gives us (26+26+10)^6 i.e. lots of combinations )
     * 
     * The array called "files" in the lookup table file has to be sorted each time a new file is added
     */
    return new Promise((resolve,reject)=>{
        fs.readFile('./cdn/cdnLookup.json', (err, content)=>{
            if (err) reject('LOOKUP_ERROR', err);
            let lookupTable = JSON.parse(content);

            /**
             * This bit will check if the lookupTable is busy
             * If its busy, it makes the changes in a new file and starts another
             * process to merge the changes when the file becomes free
             */
            if (!lookupTable.writeLock) {
                lookupTable.writeLock = true;
                fs.writeFileSync('./cdn/cdnLookup.json', lookupTable);

                // Continue
            } else {
                var newLookupTable = {
                    "writeLock" : true,
                    "files" : [{
                        // add the newly uploaded files
                    }]
                };
                fs.writeFileSync('./cdn/cdnLookup-' + generateFileId(6) + '.json', lookupTable);

                // Continue
            }
        })
    });
}

function mergeLookupTable() {
    // Ignore this right now
}

function generateFileId(len) {
    var id = "";
    for(let k=0; k<len; k++)
        id += Math.floor( (Math.random())*16 ).toString(16);
    return id;
}
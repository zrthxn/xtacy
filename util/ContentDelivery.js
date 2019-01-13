const fs = require('fs');

/**
 * @author zrthxn
 * 
 * Content Delivery Library
 * ------------------------
 * * Important *
 */

exports.Lookup = (fileRef) => {
    var fileId = parseInt(fileRef, 36)
    /**
     * @author zrthxn
     * This function does the searching part and it has to be made fast
     * See the cdn folder for a clearer view of this
     * The file called cdnJookup.js is the lookup table
     * Inside that you'll see "$schema" and that sorta describes how data will eventually be stored
     */
    return new Promise((resolve,reject)=>{
        
    });
}

exports.Upload = (file) => {
    var fileRef = generateFileRef()
    var fileId = parseInt(fileRef, 36)
    /**
     * @author zrthxn
     * The array called "files" in the lookup table file 
     * has to be sorted each time a new file is added
     */
    return new Promise((resolve,reject)=>{
        // fs.readFile('./cdn/cdnLookup.json', (err, content)=>{
        //     if (err) reject('LOOKUP_ERROR', err);
        
        //     }
        // })
    });
}

function generateFileRef() {
    let fileRef = '', date = new Date()
    let lookupTable = JSON.parse(fs.readFileSync('./cdn/cdnLookup.json').toString())
    lookupTable.fileRefNumber++
    
    let day = date.getDate()>=10 ? (date.getDate()).toString() : '0' + (date.getDate()).toString() 
    let month = date.getMonth()>=9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString()
    let dateDesgn = parseInt(day + month).toString(36).substring(1), l = 2 - dateDesgn.length
    for (let i=0; i<l; i++)
        dateDesgn = '0' + dateDesgn

    let flRef = (lookupTable.fileRefNumber).toString(36), k = 2 - flRef.length
    for (let i=0; i<k; i++)
        flRef = '0' + flRef

    fs.writeFileSync('./cdn/cdnLookup.json', JSON.stringify(lookupTable, null, 4))
    fileRef =  dateDesgn + flRef

    return fileRef
}
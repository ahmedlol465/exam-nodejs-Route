import multer from 'multer'
import { allowedExetintion } from '../uitils/allowedExtentions.js'


export const multermiddleHost = ({
        extensions = allowedExetintion.pdf
})=> {

// dislStorage
    const storage = multer.diskStorage({
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        } 
    })

    // file fillter
    const fileFilter = (req,file,cb)=> {
        //console.log(file.mimetype)
        if (extensions.includes(file.mimetype.split('/')[1])) {
            return cb(null, true);
        }
        cb (new Error('formate not allowed'), false)
    }


    const file = multer({fileFilter ,storage})
    return file


}























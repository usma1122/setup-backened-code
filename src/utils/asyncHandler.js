//  in try Catch 
// const asyncHandler = (fn)=> async(req ,res, next)=>{
//   try {
//         await fn(req ,res ,next)
//   } catch (error) {
//     res.status(err.code || 500).JSON({
//         success : false ,
//         messege : err.message
//     })
//   }
// }

//in promises wla
const asyncHandler = (fn) =>{
   (req ,res ,next)=>{
    Promise.resolve(fn(req ,res ,next)).catch((err)=> next(err))
   }
}


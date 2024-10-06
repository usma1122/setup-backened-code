class ApiError extends Error{
   constructor(
    statusCode ,
    message = "SomeThing Went Wrong" ,
    errors = [],
    stack = ""
   ){
     super(message)
     this.message = message,
     this.errors = errors ,
     this.statusCode =statusCode ,
     this.success = false ,
     this.data = null 

     if (stack) {
        this.stack=stack
     } else {
        Error.captureStackTrace(this ,this.constructor)
     }
   }
}

export {ApiError}
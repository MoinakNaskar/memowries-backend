class ApiResponse{
    constructor(statusCoe,data,message= "success",){
        this.statusCoe = statusCoe
        this.data = data
        this.message =  message
        this.success = statusCoe < 400
    }

}

export{ApiResponse}
export const Utils ={

    getColor: (title) => {
        // console.log("==========================")
        let rep = ""; 
        switch (title) {
            case "Bas":
                return  rep = "secondary" 
                break;
            case "normal":
                return  rep = "primary" 
                break;
            case "Urgent":

                return  rep = "warning" 
                break;
                
                default:
                    break;
                }
                // console.log(rep)
                // rep;
    }
}
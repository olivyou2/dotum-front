interface IMsgStore {
    [name: string]: IMsg
}

interface IParamStore {
    [name: string]: IParam
}

interface IParam{
    Callback: (callback: (err: string) => void)=>void
}

interface IMsg{
    Params?: IParamStore,
    Callback: (param: ((param: string, callback: (callback: (err: string) => void) => void)=>void)) => void
}

export default function ErrorAlert(errors, 
    func: (msg: (msg: string, callback: (param: (param: string, callback: (callback: (err: string) => void) => void) => void)=>void)=>void) => void){
    
    try{
        let errorMessage = "";
        let msgStore:IMsgStore = {};

        func((msg: string, callback)=>{
            msgStore[msg] = {
                Params: {},
                Callback: callback
            }
        });
        
        let keys = Object.keys(msgStore);
        
        for (let key of keys){
            let msg = msgStore[key];

            msg.Callback((param: string, callback: (callback: (err: string) => void)=>void) => {
                msg.Params[param] = {
                    Callback: callback
                }
            });    
        }

        for (let error of errors){
            if (msgStore[error.msg]){
                if (error.param){
                    // Run msg->param
                    let param = msgStore[error.msg].Params[error.param];

                    if (param){
                        param.Callback((err: string) => {
                            errorMessage += err += "\n";
                        });
                    }else{
                        alert(`Unhandled exception catched <${error.msg}-${error.param}>`)
                    }
                }else{
                    let param = msgStore[error.msg].Params["default"];
                    
                    if (param){
                        param.Callback((err: string) => {
                            errorMessage += err + "\n";
                        });
                    }
                }
            }else{
                alert(`Unhandled exception catched <${error.msg}>`)
            }
        }

        return errorMessage;
    }catch(exception){
        console.log(exception);
        return "";
    }
};
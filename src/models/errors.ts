
export interface IMongoError {
    errors: {
      surname: {
        name: string;
        message: string;
        properties: {
          message: string;
          type: string;
          path: string;
        };
        kind: string;
        path: string;
      };
    };
    _message: string;
    message: string;
  }
  
  export interface ICustomError {
    code: any;
    message: string;
  }
  
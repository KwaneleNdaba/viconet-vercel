const formidable = require('formidable');
const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client, S3 } = require("@aws-sdk/client-s3");
const Transform = require('stream').Transform;

const accessKeyId = "AKIAWZJISUVZFECDPLFX";
const secretAccessKey = "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";
const region = "af-south-1";
const Bucket = "param-hr-resources";

export const parsefile = async (req:any) => {
    return new Promise((resolve, reject) => {
        let options = {
            maxFileSize: 100 * 1024 * 1024, //100 megabytes converted to bytes,
            allowEmptyFiles: false
        }

        const form = formidable(options);
        
        // method accepts the request and a callback.
        form.parse(req, (err:any, fields:any, files:any) => {
          
        });

        form.on('error', (error:any) => {
            reject(error.message)
        })

        form.on('data', (data:any) => {
            if (data.name === "complete") {
                resolve(data.value);
            }
        })

        form.on('fileBegin', (formName:any, file:any) => {
        
            file.open = async function () {
                this._writeStream = new Transform({
                    transform(chunk:any, encoding:any, callback:any) {
                        callback(null, chunk)
                    }
                })

                this._writeStream.on('error', (e:any) => {
                    form.emit('error', e)
                });

                // upload to S3
                new Upload({
                    client: new S3Client({
                        credentials: {
                            accessKeyId,
                            secretAccessKey
                        },
                        region
                    }),
                    params: {
                        ACL: 'public-read',
                        Bucket,
                        Key: `${Date.now().toString()}-${this.originalFilename}`,
                        Body: this._writeStream
                    },
                    tags: [], // optional tags
                    queueSize: 4, // optional concurrency configuration
                    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
                    leavePartsOnError: false, // optional manually handle dropped parts
                })
                    .done()
                    .then((data:any) => {
                        form.emit('data', { name: "complete", value: data });
                    }).catch((err:any) => {
                        form.emit('error', err);
                    })
            }

            file.end = function (cb:any) {
                this._writeStream.on('finish', () => {
                    this.emit('end')
                    cb()
                })
                this._writeStream.end()
            }
        })
    })
}


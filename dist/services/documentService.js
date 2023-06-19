"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsefile = void 0;
const formidable = require('formidable');
const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client, S3 } = require("@aws-sdk/client-s3");
const Transform = require('stream').Transform;
const accessKeyId = process.env.NEXT_PUBLIC_AWS_KEY;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET;
console.log("ACCESS", accessKeyId);
console.log("KEY", secretAccessKey);
const region = "af-south-1";
const Bucket = "param-hr-resources";
const parsefile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        let options = {
            maxFileSize: 100 * 1024 * 1024,
            allowEmptyFiles: false
        };
        const form = formidable(options);
        // method accepts the request and a callback.
        form.parse(req, (err, fields, files) => {
        });
        form.on('error', (error) => {
            reject(error.message);
        });
        form.on('data', (data) => {
            if (data.name === "complete") {
                resolve(data.value);
            }
        });
        form.on('fileBegin', (formName, file) => {
            file.open = function () {
                return __awaiter(this, void 0, void 0, function* () {
                    this._writeStream = new Transform({
                        transform(chunk, encoding, callback) {
                            callback(null, chunk);
                        }
                    });
                    this._writeStream.on('error', (e) => {
                        form.emit('error', e);
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
                        tags: [],
                        queueSize: 4,
                        partSize: 1024 * 1024 * 5,
                        leavePartsOnError: false, // optional manually handle dropped parts
                    })
                        .done()
                        .then((data) => {
                        form.emit('data', { name: "complete", value: data });
                    }).catch((err) => {
                        form.emit('error', err);
                    });
                });
            };
            file.end = function (cb) {
                this._writeStream.on('finish', () => {
                    this.emit('end');
                    cb();
                });
                this._writeStream.end();
            };
        });
    });
});
exports.parsefile = parsefile;
//# sourceMappingURL=documentService.js.map
let fs = require("node-fs")
let path = require('path');


export default class fileDisplay {
    filePath = '';
    constructor(filePath: string) {
        this.filePath = filePath;
    }

    start(event: (filePath:string) => void) {
        this.foreach(this.filePath, event);
    }

    private foreach(filePath: string, event?: (filePath: string) => void) {
        fs.readdir(filePath, (err: any, files: any[]) => {
            if (err) {
                console.warn(err)
            } else {
                //遍历读取到的文件列表
                files.forEach((filename) => {
                    //获取当前文件的绝对路径
                    var filedir = path.join(filePath, filename);
                    //根据文件路径获取文件信息，返回一个fs.Stats对象
                    fs.stat(filedir, (eror: any, stats: { isFile: () => any; isDirectory: () => any; }) => {
                        if (eror) {
                            console.warn('获取文件stats失败');
                        } else {
                            var isFile = stats.isFile();//是文件
                            var isDir = stats.isDirectory();//是文件夹
                            if (isFile) {
                                // console.log(filedir);
                                event && event(filedir)
                            }
                            if (isDir) {
                                // console.log(filedir)
                                this.foreach(filedir,event);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                            }
                        }
                    })
                });
            }
        });
    }

}
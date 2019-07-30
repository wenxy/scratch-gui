import {Message} from '@alifd/next';
import {uploadPath} from './http/URLs';
import {http} from './http/HttpUtil';
import log from '../lib/log';
import cookies from 'js-cookie';

export default (projectId, filename, blob, callback) => {
    // console.log('save cloud blob , filename', blob ,filename);
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('projectId', projectId)
    formData.append('fileName', filename);
    formData.append('sid',cookies.get('sweet_sid'));
    console.log('=====>save to cloud, size = ',blob.size, ',type = ', blob.type)
    Message.show({
        type: 'loading',
        title: '提交作业',
        content: '请稍后，正在提交作业...！',
        hasMask: true,
        shape: 'toast',
        duration: 0
    })

    http.post(uploadPath, formData)
        .then(data => {
            log.debug(`save sb to cloud. ${data}`);

            Message.show({
                type: 'success',
                title: '提交作业',
                content: '提交作业成功！！',
                hasMask: true,
                shape: 'toast'
            });

            callback(data);
        })
        .catch(() => {
            Message.show({
                type: 'error',
                title: '提交作业',
                content: '提交作业失败，请稍后再试！',
                hasMask: true,
                shape: 'toast'
            });
        });
    /* {
        method: 'post',
        url: uploadUrl,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });*/
};

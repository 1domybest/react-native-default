import {ConstCode} from './ConstCode'
import AWS from 'aws-sdk'

class AWSS3 {
  deleteFile (key) {
    let _this = this
    let data = _this.deleteObject(ConstCode.AWS_CODE.AWSalbumBucketName, key) // 파일 업로드
    return data
  }

  deleteObject (bucket, key) {
    AWS.config.update({
      region: ConstCode.AWS_CODE.AWSbucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: ConstCode.AWS_CODE.AWSIdentityPoolId
      })
    })

    var s3 = new AWS.S3({
      params: {
        Bucket: bucket,
        Key: key
      }
    })
    var params = {
      Bucket: bucket,
      Key: key
    }
    s3.deleteObject(params, function (err, data) {
      if (err) {
        console.log(err)
      } else {
        console.log(data)
      }
    })
  }

  async uploadFile (file, type) {
    let result = await this.uploadAWS(ConstCode.AWS_CODE.AWSalbumBucketName, file, type); // 파일 업로드
    return result;
  }

  uploadAWS (bucket, file, type) {
    AWS.config.update({
      region: ConstCode.AWS_CODE.AWSbucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: ConstCode.AWS_CODE.AWSIdentityPoolId
      })
    })
    var s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: bucket}
    })

    var today = new Date()
    var year = today.getFullYear()
    var month = ('0' + (today.getMonth() + 1)).slice(-2)
    var day = ('0' + today.getDate()).slice(-2)
    var uploadDay = year.toString() + month.toString() + day.toString()

    var albumPhotosKey = '/user/' + type + '/' + uploadDay + '/'
    var photoKey = albumPhotosKey + file['name'].split('.')[0] + today.getHours() + today.getSeconds() + '.' + file['name'].split('.')[1]
    var upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: bucket,
        Key: photoKey,
        Body: file.uri
      }
    })

    upload.on('httpUploadProgress', (progress) => { // 퍼센트 게이지
      // _this.progress = Math.floor((progress.loaded * 100) / progress.total)
      // _this.progressText = _this.progress + '%'
  
    })

    var promise = upload.promise()

    // promise.then(
    //   function (data) {
    //     // _this.progress = 0
    //   }
    // )
    return promise
  }

  downloadFile (bucket, key) {
    const s3bucket = new AWS.S3({
      region: ConstCode.AWS_CODE.AWSbucketRegion, // 버킷 위치
      signatureVersion: 'v4', // 버전
      accessKeyId: ConstCode.AWS_CODE.AWSAccessKey, // 엑세스키 (IAM)
      secretAccessKey: ConstCode.AWS_CODE.AWSSecretAccessKey, // 비밀 엑세스키 (IAM)
      Bucket: bucket // 버킷이름
    })
    const url = s3bucket.getSignedUrl('getObject', { // 일회용 확인완료된 url
      Bucket: bucket,
      Key: key,
      Expires: 300 // 5분 동안만 유지됨
    })
    return url
  }
}

export default new AWSS3()

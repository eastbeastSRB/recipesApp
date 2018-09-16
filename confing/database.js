if(process.env.NODE_ENV === 'production'){
  module.exports = {
    mongoURI: 'mongodb://alex:alex12@ds247191.mlab.com:47191/recepies-app'
  }
}else{
  module.exports = {
    mongoURI: 'mongodb://localhost/recepies-app'
  }
}
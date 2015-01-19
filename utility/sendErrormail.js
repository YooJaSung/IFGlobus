/**
 * Created by airnold on 15. 1. 14..
 */

var nodemailer = require('nodemailer');
var jasung = require('../personal.js');



// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: jasung.gmail.id,
        pass: jasung.gmail.password
    }
});

exports.sendEmail = function(data){
    var mailOptions = {
        from: 'airnold0986@gmail.com',
        to: 'airnold0986@gmail.com, ksw1652@gmail.com',
        subject: 'IFGlobus node server error  ✔',
        text: data
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
};
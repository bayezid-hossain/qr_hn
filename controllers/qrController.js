const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Bus = require('../models/busModel');
const qr = require('qr-image');
const logger = require('../logger/index');
var fs = require('fs');
var zipper = require('zip-local');
const { pipeline } = require('stream');
//Register a busOwner

exports.generateQRCode = catchAsyncErrors(async (req, res, next) => {
  // const bus = Bus.findById(req.params.id);
  // if (!bus) {
  //   return next(new ErrorHandler('Invalid Bus ID', 400));
  // }

  // res.json({
  //   message: 'test',
  //   bus,
  // });
  if (
    !req.user.role.toLowerCase() == 'admin' ||
    !req.user.role.toLowerCase() == 'busowner'
  )
    return next(new ErrorHandler(`Unauthorized access!`, 400));
  const profiler = logger.startTimer();
  const bus = await Bus.findById(req.params.id).select(
    '_id owner routeId seatNumber ac'
  );

  if (!bus) {
    profiler.done({
      message: `Tried to generate QR code with invalid BUS ID`,

      level: 'info',
      actionBy: req.user.id,
    });
    return next(
      new ErrorHandler(`No bus found with the id : ${req.params.id}`, 400)
    );
  } else if (req.user.role.toLowerCase() == 'busowner')
    if (!req.user.buses.includes(bus._id)) {
      profiler.done({
        message: `Tried to generate QR code for BUS ID:${req.params.id} which is not owned by user ${req.user.id}`,

        level: 'info',
        actionBy: req.user.id,
      });
      return next(
        new ErrorHandler(`No bus found with the id : ${req.params.id}`, 400)
      );
    }
  var dir = './qrimages/' + req.params.id;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  for (i = 1; i <= bus.seatNumber; i++) {
    const qrString = {
      b: req.params.id,
      a: bus.owner.toString(),
      ac: bus.ac,
      r: bus.routeId.toString(),
      s: i,
    };
    console.log(qrString);
    var code = qr.image(JSON.stringify(qrString), { type: 'png' });
    code.pipe(require('fs').createWriteStream(`${dir}/${i}.png`));
  }
  zipper.zip(dir, function (error, zipped) {
    if (!error) {
      zipped.compress(); // compress before exporting

      var buff = zipped.memory(); // get the zipped file as a Buffer

      // or save the zipped file to disk
      zipped.save(`${dir}/QRCodes.zip`, function (error) {
        if (!error) {
          console.log('saved successfully !');
        }
      });
    }
  });
  res.download(`${dir}/QRCodes.zip`);
});

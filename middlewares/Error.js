// Middleware لعدم العثور على المسار
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error); // تمرير الخطأ إلى middleware الخاص بمعالجة الأخطاء
};

// Middleware لمعالجة الأخطاء
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // إذا تم إرسال الترويسة بالفعل، تمرير الخطأ إلى المعالج الافتراضي
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // تعيين حالة الخطأ (500 إذا كانت الاستجابة 200)
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // إظهار الـ stack فقط في بيئة التطوير
  });
};

module.exports = {
  errorHandler,
  notFound,
};

const { createOrder, getAllOrder, deleteOrder, updateOrder, getOrderCount, getOrderStatus,getOrderById,updateStatus } = require("../Controller/orderController")
const { verifyToken, verifyAdmin, verifyUser } = require("../middlewares/verifyToken")

const router = require("express").Router()



router.route("/").post(createOrder).get(getAllOrder)  

router.route("/:id").delete(deleteOrder).put(updateOrder).get(getOrderById)

router.route("/status/:id").put(updateStatus)

router.route("/count").get(getOrderCount)  

router.route("/status/:status").get(getOrderStatus)   



module.exports = router
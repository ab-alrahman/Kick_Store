const { createOrder, getAllOrder, updateStatu, deleteOrder, updateOrder, getOrderCount, getOrderStatus } = require("../Controller/orderController")
const { verifyToken, verifyAdmin, verifyUser } = require("../middlewares/verifyToken")

const router = require("express").Router()



router.route("/").post(createOrder).get(getAllOrder)  

router.route("/:id").delete(deleteOrder).put(updateOrder)

router.route("/status/:id").put(updateStatu)

router.route("/count").get(getOrderCount)  

router.route("/status/:status").get(getOrderStatus)  



module.exports = router
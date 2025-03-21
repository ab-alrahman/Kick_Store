const { createOrder, getAllOrder, updateStatu, deleteOrder, updateOrder, getOrderCount } = require("../Controller/orderController")
const { verifyToken, verifyAdmin, verifyUser } = require("../middlewares/verifyToken")

const router = require("express").Router()



// /api/order
// router.route("/").post(verifyToken , createOrder).get(verifyAdmin , getAllOrder)  

// router.route("/:id").delete(verifyUser , deleteOrder).put(verifyUser , updateOrder)

// router.route("/statu/:id").put(verifyAdmin , updateStatu)

// router.route("/count").get(verifyAdmin , getOrderCount)


router.route("/").post(createOrder).get(getAllOrder)  

router.route("/:id").delete( deleteOrder).put( updateOrder)

router.route("/statu/:id").put( updateStatu)

router.route("/count").get( getOrderCount)




module.exports = router
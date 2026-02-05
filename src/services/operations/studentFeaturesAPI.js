import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
// import rzpLogo from "../../assets/Images/logo.jpg";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

// Function to dynamically load Razorpay SDK
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Main function to buy courses
export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
  const toastId = toast.loading("Loading...");
  try {
    
    // 1️⃣ Load Razorpay SDK
    const sdkLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!sdkLoaded) {
      toast.error("Razorpay SDK failed to load");
      return;
    }
    
//console.log("courses", courses);
    // 2️⃣ Create order on backend
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      { Authorization: `Bearer ${token}` }
    );
    //console.log("loading sdk1");
    if (!orderResponse?.data?.success) {
      throw new Error(orderResponse?.data?.message || "Order creation failed");
    }

    const order = orderResponse.data.message;
   // console.log("order data", order);
// console.log("RAZORPAY KEY 👉", import.meta.env.VITE_RAZORPAY_KEY);
    // 3️⃣ Configure Razorpay options
    const options = {
       key: import.meta.env.VITE_RAZORPAY_KEY,
      currency: order.currency,
      amount: order.amount, // make sure backend sends amount in paise
      order_id: order.id,
      name: "Course Craft",
      description: "Thank you for purchasing the course",
    //   image: rzpLogo,
      prefill: {
        name: userDetails?.firstName || "",
        email: userDetails?.email || ""
      },
      handler: function (response) {
        // Send payment success email
        sendPaymentSuccessEmail(response, order.amount, token);
        // Verify payment
        verifyPayment({ ...response, courses }, token, navigate, dispatch);
      }
    };

    // 4️⃣ Open Razorpay Checkout
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    // 5️⃣ Handle payment failures
    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops, payment failed");
      console.error("Payment failed:", response.error);
    });
  } catch (error) {
    console.error("PAYMENT API ERROR1:", error);
    toast.error(error.message || "Could not make payment");
  } finally {
    toast.dismiss(toastId);
  }
}

// Function to send payment success email
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response?.razorpay_order_id,
        paymentId: response?.razorpay_payment_id,
        amount
      },
      { Authorization: `Bearer ${token}` }
    );
  } catch (error) {
    console.error("PAYMENT SUCCESS EMAIL ERROR:", error);
  }
}

// Function to verify payment on backend
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...");
  dispatch(setPaymentLoading(true));
  try {
    const response = await apiConnector(
      "POST",
      COURSE_VERIFY_API,
      bodyData,
      { Authorization: `Bearer ${token}` }
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Payment verification failed");
    }

    toast.success("Payment successful! You are now enrolled in the course.");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    console.error("PAYMENT VERIFY ERROR:", error);
    toast.error(error.message || "Could not verify payment");
  } finally {
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
  }
}

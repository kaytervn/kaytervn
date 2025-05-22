package android.onlinecoursesapp.model;

public class CheckoutRequest {
    private String paymentMethod;

    public CheckoutRequest(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}

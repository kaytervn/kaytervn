import java.io.IOException;

public interface IOrder {
    void OrderService(Table tb, int pos) throws IOException;

    void MakeNewOrder(Table tb, int pos) throws IOException;

    void PayOff(Table tb, int pos) throws IOException;
}

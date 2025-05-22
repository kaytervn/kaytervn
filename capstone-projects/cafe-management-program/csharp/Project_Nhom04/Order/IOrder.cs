using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal interface IOrder
    {
        void OrderService(Table tb, int pos);
        void MakeNewOrder(Table tb, int pos);
        void PayOff(Table tb, int pos);
    }
}

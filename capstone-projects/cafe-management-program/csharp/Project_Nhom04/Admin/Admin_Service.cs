using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal partial class Admin
    {
        //Showing
        public void SearchServiceOption(string a)
        {
            Console.Clear();
            Program.OutputInfor(this.Name, this.ID);

            a = a.ToLower();
            bool check = false;
            int num;

            Console.WriteLine("\t\t[SERVICE SEARCHING]");

            for (int i = 0; i < Cafe.lservices.Count(); i++)
            {
                if (Cafe.lservices[i].ID.ToLower().Contains(a)
                || Cafe.lservices[i].Name.ToLower().Contains(a)
                || Cafe.lservices[i].Type.ToLower().Contains(a)
                || Cafe.lservices[i].Amount.ToString().Contains(a)
                || Cafe.lservices[i].Price.ToString().Contains(a))
                {
                    check = true;
                    break;
                }
            }

            if (check)
            {
                Service.OutputFields();
                for (int i = 0; i < Cafe.lservices.Count(); i++)
                {
                    if (Cafe.lservices[i].ID.ToLower().Contains(a)
                    || Cafe.lservices[i].Name.ToLower().Contains(a)
                    || Cafe.lservices[i].Type.ToLower().Contains(a)
                    || Cafe.lservices[i].Amount.ToString().Contains(a)
                    || Cafe.lservices[i].Price.ToString().Contains(a))
                    {
                        Cafe.lservices[i].Output();
                    }
                }
                Console.WriteLine();
                Console.WriteLine("[0]. Select Service");
                Console.WriteLine("[1]. Search Again");
                Console.WriteLine("[2]. Back");

                num = Program.InputNumber(0, 2);
                switch (num)
                {
                    case 0:
                        int pos = Service.SelectService();
                        OpenService(Cafe.lservices[pos], pos);
                        break;
                    case 1:
                        Console.Write(" => Searching Service Bar: ");
                        string b = Console.ReadLine();
                        SearchServiceOption(b);
                        break;
                    case 2:
                        ShowServiceList();
                        break;
                }
            }
            else
            {
                Console.WriteLine("\n\t\tNo Search Result\n");
                Console.WriteLine("[0]. Search Again");
                Console.WriteLine("[1]. Back");

                num = Program.InputNumber(0, 1);
                switch (num)
                {
                    case 0:
                        Console.Write(" => Searching Service Bar: ");
                        string b = Console.ReadLine();
                        SearchServiceOption(b);
                        break;
                    case 1:
                        ShowServiceList();
                        break;
                }
            }
        }

        public void EditService(Service sv, int pos)
        {
            Service.WriteDataService();
            Console.Clear();
            Program.OutputInfor(this.Name, this.ID);
            Console.WriteLine("\t\t[SERVICE EDITING]");
            Service.OutputFields();
            sv.Output();
            Console.WriteLine();
            Console.WriteLine("[0]. Edit Service Name");
            Console.WriteLine("[1]. Edit Service Type");
            Console.WriteLine("[2]. Edit Service Amount");
            Console.WriteLine("[3]. Edit Service Price");
            Console.WriteLine("[4]. Edit All");
            Console.WriteLine("[5]. Back");
            int num = Program.InputNumber(0, 5);

            switch (num)
            {
                case 0:
                    sv.InputName();
                    EditService(sv, pos);
                    break;
                case 1:
                    sv.InputType();
                    EditService(sv, pos);
                    break;
                case 2:
                    sv.InputAmount();
                    EditService(sv, pos);
                    break;
                case 3:
                    sv.InputPrice();
                    EditService(sv, pos);
                    break;
                case 4:
                    sv.InputName();
                    sv.InputType();
                    sv.InputAmount();
                    sv.InputPrice();
                    EditService(sv, pos);
                    break;
                case 5:
                    OpenService(sv, pos);
                    break;
            }
        }

        public void SortService()
        {
            Service.WriteDataService();
            Console.Clear();
            Program.OutputInfor(this.Name, this.ID);
            Console.WriteLine("\t\t[SERVICE SORTING]");
            Service.OutputFields();
            for (int i = 0; i < Cafe.lservices.Count(); i++)
            {
                Cafe.lservices[i].Output();
            }
            Console.WriteLine();
            Console.WriteLine("[0]. Sort (ID)");
            Console.WriteLine("[1]. Sort (Name)");
            Console.WriteLine("[2]. Sort (Type)");
            Console.WriteLine("[3]. Sort (Amount)");
            Console.WriteLine("[4]. Sort (Price)");
            Console.WriteLine("[5]. Back");
            int num = Program.InputNumber(0, 5);
            switch (num)
            {
                case 0:
                    Service.SortID();
                    SortService();
                    break;
                case 1:
                    Service.SortName();
                    SortService();
                    break;
                case 2:
                    Cafe.lservices.Sort();
                    SortService();
                    break;
                case 3:
                    Service.SortAmount();
                    SortService();
                    break;
                case 4:
                    Service.SortPrice();
                    SortService();
                    break;
                case 5:
                    ShowServiceList();
                    break;
            }
        }

        public void OpenService(Service sv, int pos)
        {
            Console.Clear();
            Program.OutputInfor(this.Name, this.ID);
            Console.WriteLine("\t\t[SERVICE SETTINGS]");
            Service.OutputFields();
            sv.Output();
            Console.WriteLine();
            Console.WriteLine("[0]. Edit Service");
            Console.WriteLine("[1]. Delete Service");
            Console.WriteLine("[2]. Back");

            int num = Program.InputNumber(0, 2);
            switch (num)
            {
                case 0:
                    EditService(sv, pos);
                    break;
                case 1:
                    Cafe.lservices.RemoveAt(pos);
                    ShowServiceList();
                    break;
                case 2:
                    ShowServiceList();
                    break;
            }
        }

        public void ShowServiceList()
        {
            Service.WriteDataService();
            Console.Clear();
            Program.OutputInfor(this.Name, this.ID);
            Console.WriteLine("\t\t[SERVICE LIST]");
            int num;
            if (Cafe.lservices.Count() == 0)
            {
                Console.WriteLine("\n\t\tNo Service Added\n");
                Console.WriteLine("[0]. Add Service");
                Console.WriteLine("[1]. Back");
                num = Program.InputNumber(0, 1);
                switch(num)
                {
                    case 0:
                        Service.AddNewService();
                        ShowServiceList();
                        break;
                    case 1:
                        Login();
                        break;
                }
            }
            else
            {
                Service.OutputFields();
                for (int i = 0; i < Cafe.lservices.Count(); i++)
                {
                    Cafe.lservices[i].Output();
                }
                Console.WriteLine();
                Console.WriteLine("[0]. Add Service");
                Console.WriteLine("[1]. Select Service");
                Console.WriteLine("[2]. Search Service");
                Console.WriteLine("[3]. Sort Service");
                Console.WriteLine("[4]. Reset Service ID");
                Console.WriteLine("[5]. Back");

                num = Program.InputNumber(0, 5);

                switch (num)
                {
                    case 0:
                        Service.AddNewService();
                        ShowServiceList();
                        break;
                    case 1:
                        int pos = Service.SelectService();
                        OpenService(Cafe.lservices[pos], pos);
                        break;
                    case 2:
                        Console.Write(" => Searching Service Bar: ");
                        string a = Console.ReadLine();
                        SearchServiceOption(a);
                        break;
                    case 3:
                        SortService();
                        break;
                    case 4:
                        Service.ResetServiceID();
                        ShowServiceList();
                        break;
                    case 5:
                        Login();
                        break;
                }
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal interface ITable
    {
        void ShowTableList();
        void SearchTableOption(string a);
        void OpenTable(Table tb, int pos);
        void SortTable();
    }
}

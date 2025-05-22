#include "Library.h"

Cafe cafe;
Date nDate;
vector<Staff> lStaffs;
vector<Service> lServices;
vector<Table> lTables;
vector<Bill> lBills;

int main()
{
    cafe.setsCafename("GAMTIME Cafe");
    cafe.setsOwner("Mr. Trong & Mr. Trung");
    cafe.setsAddress("3 No. 9, KDC, District 7, Ho Chi Minh City");

    ReadData();
    MainLogin();
}
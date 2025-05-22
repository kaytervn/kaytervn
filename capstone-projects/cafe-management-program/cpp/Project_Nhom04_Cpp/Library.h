#pragma once
#include <iostream>
#include <string>
#include <iomanip>
#include <fstream>
#include <stdio.h>
#include <cstdlib>
#include <vector>
#include <assert.h>
#include <stddef.h>
#define MAX 100
using namespace std;

//PROGRAM
void ReadData();
int InputNumber(int dau, int cuoi);
int InputNumber_Int();
double InputNumber_Double();
void InputDate(string name, string id);
void MainLogin();
string toLower(string a);
void OutputInfor(string name, string id);
string InputString();
int SplitString(string split[], string a, char sign);

//CLASSES
class Date
{
private:
	int iDay;
	int iMonth;
	int iYear;

public:
	int getiDay();
	void setiDay(int iDay);
	int getiMonth();
	void setiMonth(int iMonth);
	int getiYear();
	void setiYear(int iYear);
	Date();
	~Date();
	void Input();
	void Output();
};

bool IsEqual(Date a, Date b);
bool IsLeapYear(int y);
int DaysInMonth(int m, int y);
bool IsDate(int Day, int Month, int Year);
Date ToDate(string a);
bool IsMore(Date a, Date b);
std::string ToString(Date a);

class Time
{
private:
	int iHour;
	int iMinute;
	int iSecond;

public:
	int getiHour();
	void setiHour(int iHour);
	int getiMinute();
	void setiMinute(int iMinute);
	int getiSecond();
	void setiSecond(int iSecond);
	Time();
	void Input();
	void Output();
	bool IsTime(int Hour, int Minute, int Second);
};

bool IsMore(Time a, Time b);
string ToString(Time a);
Time ToTime(string a);

class Account
{
private:
	string sUsername;
	string sPassword;

public:
	string getsUsername();
	void setsUsername(string sUsername);
	string getsPassword();
	void setsPassword(string sPassword);
	Account();
	~Account();
	Account(string username, string password);
	void InputUsername();
	void InputPassword();
	void Input();
	void AddUsername();
	void AddAccount();
};

bool IsExist(string username);
bool IsExist(Account account);
void AccessLogin(Account login);
bool IsEqual(Account a, Account b);
bool IsNotEqual(Account a, Account b);

class Order
{
private:
	string sServiceName;
	int iAmount;
	double dPrice;
	double dCost;

public:
	string getsServiceName();
	void setsServiceName(string sServiceName);
	int getiAmount();
	void setiAmount(int iAmount);
	double getdPrice();
	void setdPrice(double dPrice);
	double getdCost();
	void setdCost(double dCost);
	Order();
	Order(string servicename, int amount, double price, double cost);
	void InputAmount(int pos);
	void Output(vector<Order> loders);
	int FindPadRight();
	void CalsCost();

};

void OutputOrderFields(vector<Order> loders);
int PadRightMaxOrder(vector<Order> loders);
int SelectServiceOrder();

class Table
{
private:
	string sID = "TB";
	string sStatus;

public:
	vector<Order> lOrder;
	string getsID();
	void setsID(string sID);
	string getsStatus();
	void setsStatus(string sStatus);
	Table();
	void InputStatus();
	void Input();
	void Output();
};

int FindMaxTableID();
void SortTableID();
void SortTableStatus();
int SearchTable(string id);
void AddNewTable();
int SelectTable();
void ResetTableID();
void WriteDataTable();
void ReadDataTable();

class Bill
{
private:
	string sID = "BL";
	string sStaffName;
	Date dDate;
	Time tTime;
	double dTotal;

public:
	string getsID();
	void setsID(string id);
	string getsStaffName();
	void setsStaffName(string sStaffName);
	Date getdDate();
	void setdDate(Date dDate);
	Time gettTime();
	void settTime(Time time);
	double getdTotal();
	void setdTotal(double tt);
	Bill();
	Bill(string id, string StaffName, Date date, Time time, double total);
	void Input();
	int FindMaxBillID();
	void Output();
	int FindPadRight();
	void CalsTotal(vector<Order> loders);
};

void OutputBillFields();
void SortBillID();
void SortBillStaffName();
void SortBillDate();
void SortBillTotal();
int PadRightMaxBill();
void CalsToTalIncome();
void WriteDataBill();
void ReadDataBill();

class Service
{
private:
	string sID = "SV";
	string sName;
	string sType;
	int iAmount;
	double dPrice;

public:
	string getsID();
	void setsID(string sID);
	string getsName();
	void setsName(string sName);
	string getsType();
	void setsType(string sType);
	int getiAmount();
	void setiAmount(int iAmount);
	double getdPrice();
	void setdPrice(double dPrice);
	Service();
	Service(string sID, string sName, string sType, int iAmount, double dPrice);
	void InputName();
	void InputType();
	void InputAmount();
	void InputPrice();
	int FindPadRight();
	void Output();
	void Input();
};

int PadRightMaxService();
void OutputServiceFields();
int FindMaxServiceID();
void SortServiceID();
void SortServiceType();
void SortServiceName();
void SortServiceAmount();
void SortServicePrice();
int SearchService(string id);
void AddNewService();
int SelectService();
void ResetServiceID();
void WriteDataService();
void ReadDataService();

class Staff
{
private:
	string sID;
	string sName;
	string sIDCard;
	string sSex;
	Date dBirth;
	string sPhoneNumber;
	string sAddress;
	string sType;
	Account aAccount;

public:
	string getsID();
	void setsID(string sID);
	string getsName();
	void setsName(string sName);
	string getsIDCard();
	void setsIDCard(string sIDCard);
	string getsSex();
	void setsSex(string sSex);
	Date getdBirth();
	void setdBirth(Date dBirth);
	string getsPhoneNumber();
	void setsPhoneNumber(string sPhoneNumber);
	string getsAddress();
	void setsAddress(string sAddress);
	string getsType();
	void setsType(string sType);
	Account getaAccount();
	void setaAccount(Account aAccount);
	Staff();
	~Staff();
	Staff(string sID, string sName, string sIDCard, string sSex, Date dBirth, string sPhoneNumber, string sAddress, string sType, Account aAccount);
	void InputName();
	void InputIDCard();
	void InputSex();
	void InputBirth();
	void InputPhoneNumber();
	void InputAddress();
	void Input();
	int FindPadRight();
	void Output();

	//StaffService
	void LoginStaff();
	void OrderServiceStaff(Table& tb, int pos);
	void MakeNewOrderStaff(Table& tb, int pos);
	void PayOffStaff(Table& tb, int pos);
	void ShowTableListStaff();
	void SearchTableOptionStaff(string a);
	void OpenTableStaff(Table& tb, int pos);
	void SortTableStaff();

	//Admin
	void Login();
	void Statistic(int& d, int& m, int& y);
	void SelectStatistical(int& d, int& m, int& y);
	void SortBill();
	void ShowBillList();
	void SearchServiceOption(string a);
	void EditService(Service& sv, int pos);
	void SortService();
	void OpenService(Service& sv, int pos);
	void ShowServiceList();
	void EditStaff(Staff& staff, int pos);
	void SortStaff();
	void OpenStaff(Staff& staff, int pos);
	void SearchStaffOption(string a);
	void ShowStaffList();
	void ShowTableList();
	void SearchTableOption(string a);
	void OpenTable(Table& tb, int pos);
	void SortTable();
	void OrderService(Table& tb, int pos);
	void MakeNewOrder(Table& tb, int pos);
	void PayOff(Table& tb, int pos);
};

int StaffCount();
int FindMaxStaffID();
int PadRightMaxStaff();
void SortStaffType();
void SortStaffID();
void SortStaffName();
void SortStaffIDCard();
void SortStaffSex();
void SortStaffPhoneNumber();
void SortStaffAddress();
void SortStaffBirth();
int SelectStaff();
void AddNewStaff();
void OutputStaffFields();
int SearchStaff(string id);
void ResetStaffID();
void WriteDataStaff();
void ReadDataStaff();

class Cafe
{
private:
	string sCafename;
	string sOwner;
	string sAddress;
	double dTotal;

public:
	string getsCafename();
	void setsCafename(string sCafename);
	string getsOwner();
	void setsOwner(string sOwner);
	string getsAddress();
	void setsAddress(string sAddress);
	double getdTotal();
	void setdTotal(double dTotal);
};

//GLOBAL VARIABLES
extern Cafe cafe;
extern Date nDate;
extern vector<Staff> lStaffs;
extern vector<Service> lServices;
extern vector<Table> lTables;
extern vector<Bill> lBills;
#include "Library.h"

//properties
int Date::getiDay() {
	return iDay;
}

void Date::setiDay(int iDay) {
	this->iDay = iDay;
}

int Date::getiMonth() {
	return iMonth;
}

void Date::setiMonth(int iMonth) {
	this->iMonth = iMonth;
}

int Date::getiYear() {
	return iYear;
}

void Date::setiYear(int iYear) {
	this->iYear = iYear;
}

Date::Date() {
}

Date::~Date() {
}

void Date::Input() {
	string a;
	Date b;

	while (true) {
		try {

			cout << "Date [dd/mm/yy]: ";
			getline(cin, a);

			b = ToDate(a);

			if (!IsDate(b.iDay, b.iMonth, b.iYear))
				continue;
			else
			{
				this->iDay = b.iDay;
				this->iMonth = b.iMonth;
				this->iYear = b.iYear;
				break;
			}
		}
		catch (exception e) {
			continue;
		}
	}
}

//Output
void Date::Output() {
	cout << to_string(this->iDay) + "/" + to_string(this->iMonth) + "/" + to_string(this->iYear);
}

//DATE methods
//Operators
bool IsEqual(Date a, Date b) {
	return (a.getiDay() == b.getiDay()) && (a.getiMonth() == b.getiMonth()) && (a.getiYear() == b.getiYear());
}

bool IsMore(Date a, Date b) {
	if (a.getiYear() > b.getiYear()) return true;
	else if (a.getiYear() < b.getiYear()) return false;

	if (a.getiMonth() > b.getiMonth()) return true;
	else if (a.getiMonth() < b.getiMonth()) return false;

	return a.getiDay() > b.getiDay();
}

string ToString(Date a) {
	string d = "";
	d += to_string(a.getiDay()) + "/" + to_string(a.getiMonth()) + "/" + to_string(a.getiYear());
	return d;
}

bool IsLeapYear(int y) {
	return (y % 4 == 0) && (y % 100 != 0 || y % 400 == 0);
}

int DaysInMonth(int m, int y) {
	if (m == 4 || m == 6 || m == 9 || m == 11) return 30;
	else if (m == 2) {
		if (IsLeapYear(y)) return 29;
		else return 28;
	}
	else return 31;
}

bool IsDate(int Day, int Month, int Year) {
	return Day > 0 && Day <= DaysInMonth(Month, Year) && Month > 0 && Month < 13 && Year > 0;
}

Date ToDate(string a) {
	Date d;
	string split[MAX];
	SplitString(split, a, '/');
	d.setiDay(stoi(split[0]));
	d.setiMonth(stoi(split[1]));
	d.setiYear(stoi(split[2]));
	return d;
}
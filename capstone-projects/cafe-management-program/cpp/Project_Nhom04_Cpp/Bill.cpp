#include "Library.h"

//properties
string Bill::getsID() {
	return sID;
}

void Bill::setsID(string id) {
	this->sID = id;
}

string Bill::getsStaffName() {
	return sStaffName;
}

void Bill::setsStaffName(string sStaffName) {
	this->sStaffName = sStaffName;
}

Date Bill::getdDate() {
	return dDate;
}

void Bill::setdDate(Date dDate) {
	this->dDate = dDate;
}

Time Bill::gettTime() {
	return tTime;
}

void Bill::settTime(Time time) {
	this->tTime = time;
}

double Bill::getdTotal() {
	return dTotal;
}

void Bill::setdTotal(double tt) {
	this->dTotal = tt;
};

//constructor
Bill::Bill() {
}

Bill::Bill(string id, string StaffName, Date date, Time time, double total) {
	this->sID = id;
	this->sStaffName = StaffName;
	this->dDate = date;
	this->tTime = time;
	this->dTotal = total;
}

// methods
void Bill::Input() {
	if (lBills.size() == 0)
		this->sID += "0";
	else
		this->sID += to_string(FindMaxBillID() + 1);

	cout << "Current Bill ID: " << this->sID << endl;
	this->tTime.Input();
}

int Bill::FindMaxBillID() {
	int id = 0;
	for (int i = 0; i < lBills.size(); i++) {
		if (stoi(lBills.at(i).getsID().substr(2)) > id)
			id = stoi(lBills.at(i).getsID().substr(2));
	}
	return id;
}

//Output
void Bill::Output() {
	cout << setw(PadRightMaxBill()) <<
		this->sID << setw(PadRightMaxBill()) <<
		this->sStaffName << setw(PadRightMaxBill()) <<
		ToString(this->dDate) << setw(PadRightMaxBill()) <<
		ToString(this->tTime) << setw(PadRightMaxBill()) <<
		this->dTotal << endl;
}

void OutputBillFields() {
	cout << endl;
	cout << setw(PadRightMaxBill()) << "[ID]" << setw(PadRightMaxBill()) <<
		"[STAFF NAME]" << setw(PadRightMaxBill()) <<
		"[DATE]" << setw(PadRightMaxBill()) <<
		"[TIME]" << setw(PadRightMaxBill()) <<
		"[TOTAL]" << endl;
}

void Bill::CalsTotal(vector<Order> loders) {
	this->dTotal = 0;

	for (int i = 0; i < loders.size(); i++) {
		this->dTotal += loders.at(i).getdCost();
	}
}

//Methods
void SortBillID() {
	for (int i = 0; i < lBills.size() - 1; i++) {
		for (int j = i + 1; j < lBills.size(); j++) {
			if (lBills.at(i).getsID() > lBills.at(j).getsID()) {
				Bill tmp = lBills.at(i);
				lBills.at(i) = lBills.at(j);
				lBills.at(j) = tmp;
			}
		}
	}
}

void SortBillStaffName() {
	for (int i = 0; i < lBills.size() - 1; i++) {
		for (int j = i + 1; j < lBills.size(); j++) {
			if (lBills.at(i).getsStaffName() > lBills.at(j).getsStaffName()) {
				Bill tmp = lBills.at(i);
				lBills.at(i) = lBills.at(j);
				lBills.at(j) = tmp;
			}
		}
	}
}

void SortBillDate() {
	for (int i = 0; i < lBills.size() - 1; i++) {
		for (int j = i + 1; j < lBills.size(); j++) {
			if (IsMore(lBills.at(i).getdDate(), lBills.at(j).getdDate())
				|| IsEqual(lBills.at(i).getdDate(), lBills.at(j).getdDate())
				&& IsMore(lBills.at(i).gettTime(), lBills.at(j).gettTime())) {
				Bill tmp = lBills.at(i);
				lBills.at(i) = lBills.at(j);
				lBills.at(j) = tmp;
			}
		}
	}
}

void SortBillTotal() {
	for (int i = 0; i < lBills.size() - 1; i++) {
		for (int j = i + 1; j < lBills.size(); j++) {
			if (lBills.at(i).getdTotal() > (lBills.at(j).getdTotal())) {
				Bill tmp = lBills.at(i);
				lBills.at(i) = lBills.at(j);
				lBills.at(j) = tmp;
			}
		}
	}
}

//Login Methods
int Bill::FindPadRight() {
	int max = 1;
	while (this->sID.length() > max
		|| ToString(this->dDate).length() > max
		|| ToString(this->tTime).length() > max
		|| to_string(this->dTotal).length() > max) {
		max++;
	}
	return max;
}

int PadRightMaxBill() {
	int len = lBills.at(0).FindPadRight();
	for (int i = 1; i < lBills.size(); i++) {
		if (lBills.at(i).FindPadRight() > len)
			len = lBills.at(i).FindPadRight();
	}
	return len + 10;
}

void CalsToTalIncome() {
	for (int i = 0; i < lBills.size(); i++) {
		cafe.setdTotal(cafe.getdTotal() + lBills.at(i).getdTotal());
	}
}

//FILES
void WriteDataBill() {
	string wt[MAX];
	for (int i = 0; i < lBills.size(); i++) {
		wt[i] = lBills.at(i).getsID() + ";" +
			lBills.at(i).getsStaffName() + ";" +
			ToString(lBills.at(i).getdDate()) + ";" +
			ToString(lBills.at(i).gettTime()) + ";" +
			to_string(lBills.at(i).getdTotal());
	}
	fstream fileout("Bill.txt", std::ios_base::out);
	for (int i = 0; i < lBills.size(); i++) {
		fileout << wt[i];
		if (i < lBills.size() - 1)
			fileout << endl;
	}
	fileout.close();
}

void ReadDataBill() {
	fstream filein("Bill.txt", std::ios_base::in);

	while (!filein.eof()) {
		string line[MAX];
		string tmp;
		int dem = 0;
		Bill bl;

		getline(filein, tmp);
		if (tmp == "")
		{
			filein.close();
			return;
		}
		dem = SplitString(line, tmp, ';');

		bl.setsID(line[0]);
		bl.setsStaffName(line[1]);
		bl.setdDate(ToDate(line[2]));
		bl.settTime(ToTime(line[3]));
		bl.setdTotal(stod(line[4]));

		lBills.push_back(bl);
	}
	CalsToTalIncome();
	filein.close();
}
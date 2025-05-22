#include "Library.h"

void ReadData() {
	ReadDataTable();
	ReadDataService();
	ReadDataBill();
	ReadDataStaff();
}

void InputDate(string name, string id) {
	system("cls");
	OutputInfor(name, id);
	nDate.Input();
}

void MainLogin() {
	system("cls");
	cout << "\t" << cafe.getsCafename() << endl;
	cout << "Owner: " << cafe.getsOwner() << endl;
	cout << "Addess: " << cafe.getsAddress() << endl;
	cout << endl;
	cout << "\tLOGIN" << endl;
	Account lg;
	lg.Input();
	if (!IsExist(lg)) {
		printf("\n\tInvalid Username Or Password!\n");
		printf("\n[0]. Try Again\n");
		int num = InputNumber(0, 0);
		MainLogin();
	}
	AccessLogin(lg);
}

string toLower(string a)
{
	string s = a;
	for (int i = 0; i < a.length(); i++) {
		s[i] = tolower(a[i]);
	}
	return s;
}

int InputNumber_Int() {
	string num;
	do {
		try {
			getline(cin, num);
			if (stoi(num) < 0 || (stoi(num) != stod(num)))
				continue;
			else
				break;
		}
		catch (exception e) {
			continue;
		}
	} while (true);
	return stoi(num);
}

double InputNumber_Double() {
	string num;
	do {
		try {
			getline(cin, num);
			if (stod(num) < 0)
				continue;
			else
				return stod(num);
		}
		catch (exception e) {
			continue;
		}
	} while (true);
	return stod(num);
}

int InputNumber(int dau, int cuoi) {
	printf("--------------------------------\n");
	string num;
	do {
		try {
			printf("Please Enter A Number");
			if (dau != cuoi)
				printf(" From %d To %d", dau, cuoi);
			printf(": ");
			getline(cin, num);

			if (stoi(num) >= dau && stoi(num) <= cuoi && stoi(num) == stod(num))
				return stoi(num);
			else
				continue;
		}
		catch (exception e) {
			continue;
		}
	} while (true);
}

string InputString() {

	string a;
	do {
		getline(cin, a);
	} while (a.find(";") != string::npos);
	return a;
}


void OutputInfor(string name, string id) {
	cout << "\t" << cafe.getsCafename() << endl;
	cout << "Owner: " << cafe.getsOwner() << endl;
	cout << "Addess: " << cafe.getsAddress() << endl;
	cout << endl;
	cout << "\tUSER INFORMATION" << endl;
	cout << "Name: " << name << endl;
	cout << "Staff ID: " << id << endl;
	if (IsDate(nDate.getiDay(), nDate.getiMonth(), nDate.getiYear())) {
		printf("Date: ");
		nDate.Output();
	}
	cout << endl;
}

int SplitString(string split[], string a, char sign)
{
	int count = 0;
	string tmp = "";
	for (int i = 0; i < a.length(); i++)
	{
		if (a[i] == sign)
		{
			split[count] = tmp;
			count++;
			tmp = "";
			i++;
		}
		tmp += a[i];
		if (i == a.length() - 1)
		{
			split[count] = tmp;
		}
	}
	return count;
}
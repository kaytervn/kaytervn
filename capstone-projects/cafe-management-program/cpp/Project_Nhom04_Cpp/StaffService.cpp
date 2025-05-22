#include "Library.h"

void Staff::LoginStaff() {
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	cout << endl;
	cout << "[0]. Information" << endl;
	cout << "[1]. Table Manager" << endl;
	cout << "[2]. Log out" << endl;

	int num = InputNumber(0, 2);
	switch (num) {
	case 0: {
		cout << "\n\t\t[STAFF INFORMATION]" << endl;
		OutputStaffFields();
		Output();
		cout << endl;
		cout << "[0]. Back" << endl;
		int num2 = InputNumber(0, 0);
		LoginStaff();
	}
	case 1: ShowTableListStaff();
	case 2: MainLogin();
	}
}

//Order
void Staff::OrderServiceStaff(Table& tb, int pos) {
	WriteDataTable();
	WriteDataService();
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	cout << "Current Table ID: " << tb.getsID() << endl;
	cout << endl;
	cout << "\t\t[SERVICE ORDERING]" << endl;

	int num;

	if (tb.lOrder.size() == 0) {
		cout << "\n\t\tNo Service Ordered" << endl;
		cout << endl;
		cout << "[0]. Make New Order" << endl;
		cout << "[1]. Back" << endl;
		num = InputNumber(0, 1);
		switch (num) {
		case 0:
			MakeNewOrderStaff(tb, pos);
			break;
		case 1:
			OpenTableStaff(tb, pos);
			break;
		}
	}
	else {
		OutputOrderFields(tb.lOrder);
		for (int i = 0; i < tb.lOrder.size(); i++) {
			tb.lOrder.at(i).Output(tb.lOrder);
		}

		cout << endl;
		cout << "[0]. Make New Order" << endl;
		cout << "[1]. Pay Off" << endl;
		cout << "[2]. Back" << endl;
		num = InputNumber(0, 2);
		switch (num) {
		case 0:
			MakeNewOrderStaff(tb, pos);
			break;
		case 1:
			PayOffStaff(tb, pos);
			break;
		case 2:
			OpenTableStaff(tb, pos);
			break;
		}
	}
}


void Staff::MakeNewOrderStaff(Table& tb, int pos) {
	WriteDataTable();
	WriteDataService();
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	cout << "Current Table ID: " << tb.getsID() << endl;
	cout << endl;
	cout << "\t\t[SERVICE MENU]" << endl;

	int num;
	if (lServices.size() == 0) {
		cout << "\n\t\tNo Service Added\n" << endl;
		cout << "[0]. Back" << endl;
		num = InputNumber(0, 0);
		OrderServiceStaff(tb, pos);
	}
	else {
		OutputServiceFields();
		for (int i = 0; i < lServices.size(); i++) {
			lServices.at(i).Output();
		}
		cout << endl;
		cout << "[0]. Select Service" << endl;
		cout << "[1]. Back" << endl;

		num = InputNumber(0, 1);
		switch (num) {
		case 0: {
			tb.setsStatus("Served");
			cout << "\n\t[ORDER SERVICE]\n" << endl;
			int SVpos = SelectServiceOrder();
			Order od;
			od.setsServiceName(lServices.at(SVpos).getsName());
			od.InputAmount(SVpos);
			od.setdPrice(lServices.at(SVpos).getdPrice());
			od.CalsCost();
			tb.lOrder.push_back(od);
			MakeNewOrderStaff(tb, pos);
			break;
		}
		case 1:OrderServiceStaff(tb, pos);
			break;
		}
	}
}


void Staff::PayOffStaff(Table& tb, int pos) {
	Bill bl;
	bl.Input();
	bl.setsStaffName(this->getsName());
	bl.setdDate(nDate);
	bl.CalsTotal(tb.lOrder);
	lBills.push_back(bl);

	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	cout << "\t\t[BILL - ID: " << bl.getsID() << "]\n";
	cout << "\tCurrent Table ID: " << tb.getsID() << endl;
	printf("\tDate: ");
	bl.getdDate().Output();
	printf("\n\tTime: ");
	bl.gettTime().Output();
	cout << endl;
	printf("\n\t\t[SERVICE ORDERED]\n");
	OutputOrderFields(tb.lOrder);
	for (int i = 0; i < tb.lOrder.size(); i++) {
		tb.lOrder.at(i).Output(tb.lOrder);
	}
	printf("\n\t--------------------------------\n");
	cout << "\tTotal: " << bl.getdTotal() << " (VND)";

	tb.lOrder.clear();
	tb.setsStatus("Empty");
	WriteDataTable();

	CalsToTalIncome();
	WriteDataBill();

	cout << endl;
	cout << "\n[0]. Continue" << endl;
	int num = InputNumber(0, 0);
	ShowTableListStaff();
}

//Table
void Staff::ShowTableListStaff() {
	WriteDataTable();
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	printf("\t\t[TABLE LIST]\n");
	int num;
	if (lTables.size() > 0) {
		cout << endl;
		cout << setw(20) << "[ID]" << setw(20) << "[STATUS]" << endl;
		for (int i = 0; i < lTables.size(); i++) {
			lTables.at(i).Output();
		}

		cout << endl;
		printf("[0]. Select Table\n");
		printf("[1]. Search Table\n");
		printf("[2]. Sort Table\n");
		printf("[3]. Back\n");

		num = InputNumber(0, 3);

		switch (num) {
		case 0: {
			int pos = SelectTable();
			OpenTableStaff(lTables.at(pos), pos);
		}
		case 1: {
			cout << " => Searching Table Bar: ";
			string b;
			getline(cin, b);
			SearchTableOptionStaff(b);
		}
		case 2: SortTableStaff();
		case 3: LoginStaff();
		}
	}
	else {
		printf("\n\t\tNo Table Added\n");
		printf("\n[0]. Back");
		num = InputNumber(0, 0);
		LoginStaff();
	}
}

void Staff::SearchTableOptionStaff(string a) {
	system("cls");
	OutputInfor(this->getsName(), this->getsID());

	a = toLower(a);
	bool check = false;
	int num;

	printf("\t\t[TABLE SEARCHING]\n");
	for (int i = 0; i < lTables.size(); i++) {
		if (toLower(lTables.at(i).getsID()).find(a) != std::string::npos
			|| toLower(lTables.at(i).getsStatus()).find(a) != std::string::npos) {
			check = true;
			break;
		}
	}

	if (check) {
		cout << endl;
		cout << setw(20) << "[ID]" << setw(20) << "[STATUS]" << endl;
		for (int i = 0; i < lTables.size(); i++) {
			if (toLower(lTables.at(i).getsID()).find(a) != std::string::npos
				|| toLower(lTables.at(i).getsStatus()).find(a) != std::string::npos) {
				lTables.at(i).Output();
			}
		}
		cout << endl;
		printf("[0]. Select Table\n");
		printf("[1]. Search Again\n");
		printf("[2]. Back\n");

		num = InputNumber(0, 2);
		switch (num) {
		case 0: {
			int pos = SelectTable();
			OpenTableStaff(lTables.at(pos), pos);
		}
		case 1: {
			printf(" => Searching Table Bar: ");
			string b;
			getline(cin, b);
			SearchTableOptionStaff(b);
		}
		case 2: ShowTableListStaff();
		}
	}
	else {
		printf("\n\t\tNo Search Result\n");
		printf("\n[0]. Search Again\n");
		printf("[1]. Back\n");

		num = InputNumber(0, 1);
		switch (num) {
		case 0: {
			printf(" => Searching Table Bar: ");
			string b;
			getline(cin, b);
			SearchTableOptionStaff(b);
		}
		case 1: ShowTableListStaff();
		}
	}
}

void Staff::OpenTableStaff(Table& tb, int pos) {
	WriteDataTable();
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	printf("\t\t[TABLE SETTINGS]\n");
	cout << endl;
	cout << setw(20) << "[ID]" << setw(20) << "[STATUS]" << endl;
	tb.Output();
	cout << endl;
	printf("[0]. Order Service\n");
	printf("[1]. Back\n");

	int num = InputNumber(0, 1);
	switch (num) {
	case 0: OrderServiceStaff(tb, pos);
	case 1: ShowTableListStaff();
	}
}

void Staff::SortTableStaff() {
	WriteDataService();
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	printf("\t\t[TABLE SORTING]\n");
	cout << endl;
	cout << setw(20) << "[ID]" << setw(20) << "[STATUS]" << endl;
	for (int i = 0; i < lTables.size(); i++) {
		lTables.at(i).Output();
	}
	cout << endl;
	printf("[0]. Sort (ID)\n");
	printf("[1]. Sort (Status)\n");
	printf("[2]. Back\n");
	int num = InputNumber(0, 2);
	switch (num) {
	case 0: {
		SortTableID();
		SortTableStaff();
	}
	case 1: {
		SortTableStatus();
		SortTableStaff();
	}
	case 2: ShowTableListStaff();
	}
}
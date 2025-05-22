#include "Library.h"

void Staff::Login() {
	system("cls");
	OutputInfor(this->getsName(), this->getsID());

	cout << endl;
	cout << "[0]. Staff Manager" << endl;
	cout << "[1]. Table Manager" << endl;
	cout << "[2]. Service Manager" << endl;
	cout << "[3]. Income Manager" << endl;
	cout << "[4]. Log out" << endl;

	int num = InputNumber(0, 4);
	switch (num) {
	case 0: ShowStaffList();
	case 1: ShowTableList();
	case 2: ShowServiceList();
	case 3: ShowBillList();
	case 4: MainLogin();
	}
}

//Admin_Bill
void Staff::Statistic(int& d, int& m, int& y) {
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	cout << "\t\t[INCOME STATISTIC]" << endl;

	double total = 0;
	int billcount = 0;
	bool check = false;
	int num;

	for (int i = 0; i < lBills.size(); i++) {
		if ((lBills.at(i).getdDate().getiDay() == d && lBills.at(i).getdDate().getiMonth() == m && lBills.at(i).getdDate().getiYear() == y)
			|| (lBills.at(i).getdDate().getiMonth() == m && lBills.at(i).getdDate().getiYear() == y && d == -1)
			|| (lBills.at(i).getdDate().getiYear() == y && d == -1 && m == -1)) {
			check = true;
			break;
		}
	}

	if (check) {
		OutputBillFields();
		for (int i = 0; i < lBills.size(); i++) {
			if ((lBills.at(i).getdDate().getiDay() == d && lBills.at(i).getdDate().getiMonth() == m && lBills.at(i).getdDate().getiYear() == y)
				|| (lBills.at(i).getdDate().getiMonth() == m && lBills.at(i).getdDate().getiYear() == y && d == -1)
				|| (lBills.at(i).getdDate().getiYear() == y && d == -1 && m == -1)) {
				lBills.at(i).Output();
				billcount++;
				total += lBills.at(i).getdTotal();
			}
		}

		printf("\t--------------------------------\n");
		cout << "\tFinal Total: " << total << " (VND)\n";
		cout << "\tBills Count: " << billcount << endl;
	}
	else {
		printf("\n\t\tNo Statistic Result\n");
	}
	cout << endl;
	printf("[0]. Get Statistic Again\n");
	printf("[1]. Back\n");
	num = InputNumber(0, 1);
	switch (num) {
	case 0: SelectStatistical(d, m, y);
	case 1: ShowBillList();
	}
}

void Staff::SelectStatistical(int& d, int& m, int& y) {
	cout << endl;
	printf("\t\t[SELECT STATISTICS]\n");
	printf("[0]. Statistical Date\n");
	printf("[1]. Statistical Month - Year\n");
	printf("[2]. Statistical Year\n");
	int num = InputNumber(0, 2);
	switch (num) {
	case 0: {
		printf(" => Enter Day: ");
		d = InputNumber_Int();
		printf(" => Enter Month: ");
		m = InputNumber_Int();
		printf(" => Enter Year: ");
		y = InputNumber_Int();
		break;
	}
	case 1: {
		d = -1;
		printf(" => Enter Month: ");
		m = InputNumber_Int();
		printf(" => Enter Year: ");
		y = InputNumber_Int();
		break;
	}
	case 2: {
		d = -1;
		m = -1;
		printf(" => Enter Year: ");
		y = InputNumber_Int();
		break;
	}
	}
	Statistic(d, m, y);
}

void Staff::SortBill() {
	WriteDataBill();
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	printf("\t\t[BILL SORTING]\n");
	OutputBillFields();
	for (int i = 0; i < lBills.size(); i++) {
		lBills.at(i).Output();
	}
	cout << endl;
	printf("[0]. Sort (ID)\n");
	printf("[1]. Sort (Staff Name)\n");
	printf("[2]. Sort (Date)\n");
	printf("[3]. Sort (Total)\n");
	printf("[4]. Back\n");
	int num = InputNumber(0, 4);
	switch (num) {
	case 0: {
		SortBillID();
		SortBill();
	}
	case 1: {
		SortBillStaffName();
		SortBill();
	}
	case 2: {
		SortBillDate();
		SortBill();
	}
	case 3: {
		SortBillTotal();
		SortBill();
	}
	case 4: ShowBillList();
	}
}

void Staff::ShowBillList() {
	WriteDataBill();
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	printf("\t\t[INCOME MANAGER]\n");
	int num;
	if (lBills.size() == 0) {
		printf("\n\t\tNo Bill Created\n\n");
		printf("[0]. Back\n");
		num = InputNumber(0, 0);
		Login();
	}
	else {
		OutputBillFields();
		for (int i = 0; i < lBills.size(); i++) {
			lBills.at(i).Output();
		}
		printf("\t--------------------------------\n");
		cout << "\tFinal Total: " << cafe.getdTotal() << " (VND)\n";
		cout << "\tBills Count: " << lBills.size() << endl;
		cout << endl;
		printf("[0]. Get Statistic\n");
		printf("[1]. Sort Bill\n");
		printf("[2]. Back\n");

		num = InputNumber(0, 2);

		switch (num) {
		case 0: {
			int d = -1;
			int m = -1;
			int y = -1;
			SelectStatistical(d, m, y);
		}
		case 1: SortBill();
		case 2: Login();
		}
	}
}

//Admin_Service
void Staff::SearchServiceOption(string a) {
	system("cls");
	OutputInfor(this->getsName(), this->getsID());

	a = toLower(a);
	bool check = false;
	int num;

	printf("\t\t[SERVICE SEARCHING]\n");

	for (int i = 0; i < lServices.size(); i++) {
		if (toLower(lServices.at(i).getsID()).find(a) != std::string::npos
			|| toLower(lServices.at(i).getsName()).find(a) != std::string::npos
			|| toLower(lServices.at(i).getsType()).find(a) != std::string::npos
			|| to_string(lServices.at(i).getiAmount()).find(a) != std::string::npos
			|| to_string(lServices.at(i).getdPrice()).find(a) != std::string::npos) {
			check = true;
			break;
		}
	}

	if (check) {
		OutputServiceFields();
		for (int i = 0; i < lServices.size(); i++) {
			if (toLower(lServices.at(i).getsID()).find(a) != std::string::npos
				|| toLower(lServices.at(i).getsName()).find(a) != std::string::npos
				|| toLower(lServices.at(i).getsType()).find(a) != std::string::npos
				|| to_string(lServices.at(i).getiAmount()).find(a) != std::string::npos
				|| to_string(lServices.at(i).getdPrice()).find(a) != std::string::npos) {
				lServices.at(i).Output();
			}
		}
		cout << endl;
		printf("[0]. Select Service\n");
		printf("[1]. Search Again\n");
		printf("[2]. Back\n");

		num = InputNumber(0, 2);
		switch (num) {
		case 0: {
			int pos = SelectService();
			OpenService(lServices.at(pos), pos);
		}
		case 1: {
			printf(" => Searching Service Bar: ");
			string b;
			getline(cin, b);
			SearchServiceOption(b);
		}
		case 2: ShowServiceList();
		}
	}
	else {
		printf("\n\t\tNo Search Result\n\n");
		printf("[0]. Search Again\n");
		printf("[1]. Back\n");

		num = InputNumber(0, 1);
		switch (num) {
		case 0: {
			printf(" => Searching Service Bar: ");
			string b;
			getline(cin, b);
			SearchServiceOption(b);
		}
		case 1: ShowServiceList();
		}
	}
}

void Staff::EditService(Service& sv, int pos) {
	WriteDataService();
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	printf("\t\t[SERVICE EDITING]\n");
	OutputServiceFields();
	sv.Output();
	cout << endl;
	printf("[0]. Edit Service Name\n");
	printf("[1]. Edit Service Type\n");
	printf("[2]. Edit Service Amount\n");
	printf("[3]. Edit Service Price\n");
	printf("[4]. Edit All\n");
	printf("[5]. Back\n");
	int num = InputNumber(0, 5);

	switch (num) {
	case 0: {
		sv.InputName();
		EditService(sv, pos);
	}
	case 1: {
		sv.InputType();
		EditService(sv, pos);
	}
	case 2: {
		sv.InputAmount();
		EditService(sv, pos);
	}
	case 3: {
		sv.InputPrice();
		EditService(sv, pos);
	}
	case 4: {
		sv.InputName();
		sv.InputType();
		sv.InputAmount();
		sv.InputPrice();
		EditService(sv, pos);
	}
	case 5: OpenService(sv, pos);
	}
}

void Staff::SortService() {
	WriteDataService();
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	printf("\t\t[SERVICE SORTING]\n");
	OutputServiceFields();
	for (int i = 0; i < lServices.size(); i++) {
		lServices.at(i).Output();
	}
	cout << endl;
	printf("[0]. Sort (ID)\n");
	printf("[1]. Sort (Name)\n");
	printf("[2]. Sort (Type)\n");
	printf("[3]. Sort (Amount)\n");
	printf("[4]. Sort (Price)\n");
	printf("[5]. Back\n");
	int num = InputNumber(0, 5);
	switch (num) {
	case 0: {
		SortServiceID();
		SortService();
	}
	case 1: {
		SortServiceName();
		SortService();
	}
	case 2: {
		SortServiceType();
		SortService();
	}
	case 3: {
		SortServiceAmount();
		SortService();
	}
	case 4: {
		SortServicePrice();
		SortService();
	}
	case 5: ShowServiceList();
	}
}

void Staff::OpenService(Service& sv, int pos) {
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	printf("\t\t[SERVICE SETTINGS]\n");
	OutputServiceFields();
	sv.Output();
	cout << endl;
	printf("[0]. Edit Service\n");
	printf("[1]. Delete Service\n");
	printf("[2]. Back\n");

	int num = InputNumber(0, 2);
	switch (num) {
	case 0: EditService(sv, pos);
	case 1: {
		lServices.erase(lServices.begin() + pos);
		ShowServiceList();
	}
	case 2: ShowServiceList();
	}
}

void Staff::ShowServiceList() {
	WriteDataService();
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	printf("\t\t[SERVICE LIST]\n");
	int num;
	if (lServices.size() == 0) {
		printf("\n\t\tNo Service Added\n\n");
		printf("[0]. Add Service\n");
		printf("[1]. Back\n");
		num = InputNumber(0, 1);
		switch (num) {
		case 0: {
			AddNewService();
			ShowServiceList();
		}
		case 1: Login();
		}
	}
	else {
		OutputServiceFields();
		for (int i = 0; i < lServices.size(); i++) {
			lServices.at(i).Output();
		}
		cout << endl;
		printf("[0]. Add Service\n");
		printf("[1]. Select Service\n");
		printf("[2]. Search Service\n");
		printf("[3]. Sort Service\n");
		printf("[4]. Reset Service ID\n");
		printf("[5]. Back\n");

		num = InputNumber(0, 5);

		switch (num) {
		case 0: {
			AddNewService();
			ShowServiceList();
		}
		case 1: {
			int pos = SelectService();
			OpenService(lServices.at(pos), pos);
		}
		case 2: {
			printf(" => Searching Service Bar: ");
			string a;
			getline(cin, a);
			SearchServiceOption(a);
		}
		case 3: SortService();
		case 4: {
			ResetServiceID();
			ShowServiceList();
		}
		case 5: Login();
		}
	}
}

//Admin_Staff
void Staff::EditStaff(Staff& staff, int pos) {
	WriteDataStaff();
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	printf("\t[STAFF EDITING]\n");
	OutputStaffFields();
	staff.Output();
	cout << endl;

	printf("[0]. Edit Staff Name\n");
	printf("[1]. Edit Staff ID Card\n");
	printf("[2]. Edit Staff Sex\n");
	printf("[3]. Edit Staff Birth\n");
	printf("[4]. Edit Staff Phone Number\n");
	printf("[5]. Edit Staff Address\n");
	printf("[6]. Edit Staff Username\n");
	printf("[7]. Edit Staff Password\n");
	printf("[8]. Edit All\n");
	printf("[9]. Back\n");
	int num = InputNumber(0, 9);
	switch (num) {
	case 0: {
		staff.InputName();
		EditStaff(staff, pos);
	}
	case 1: {
		staff.InputIDCard();
		EditStaff(staff, pos);
	}
	case 2: {
		staff.InputSex();
		EditStaff(staff, pos);
	}
	case 3: {
		staff.InputBirth();
		EditStaff(staff, pos);
	}
	case 4: {
		staff.InputPhoneNumber();
		EditStaff(staff, pos);
	}
	case 5: {
		staff.InputAddress();
		EditStaff(staff, pos);
	}
	case 6: {
		Account a = staff.getaAccount();
		a.AddUsername();
		staff.setaAccount(a);
		EditStaff(staff, pos);
	}
	case 7: {
		Account a = staff.getaAccount();
		a.InputPassword();
		staff.setaAccount(a);
		EditStaff(staff, pos);
	}
	case 8: {
		staff.InputName();
		staff.InputIDCard();
		staff.InputSex();
		staff.InputBirth();
		staff.InputPhoneNumber();
		staff.InputAddress();
		Account a = staff.getaAccount();
		a.AddUsername();
		a.InputPassword();
		staff.setaAccount(a);
		EditStaff(staff, pos);
	}
	case 9: OpenStaff(staff, pos);
	}

}

void Staff::SortStaff() {
	WriteDataStaff();
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	printf("\t[STAFF SORTING]\n");
	OutputStaffFields();
	for (int i = 0; i < lStaffs.size(); i++) {
		lStaffs.at(i).Output();
	}
	cout << endl;
	printf("[0]. Sort (ID)\n");
	printf("[1]. Sort (Name)\n");
	printf("[2]. Sort (ID Card)\n");
	printf("[3]. Sort (Sex)\n");
	printf("[4]. Sort (Birth)\n");
	printf("[5]. Sort (Phone Number)\n");
	printf("[6]. Sort (Address)\n");
	printf("[7]. Sort (Type)\n");
	printf("[8]. Back\n");

	int num = InputNumber(0, 8);
	switch (num) {
	case 0: {
		SortStaffID();
		SortStaff();
	}
	case 1: {
		SortStaffName();
		SortStaff();
	}
	case 2: {
		SortStaffIDCard();
		SortStaff();
	}
	case 3: {
		SortStaffSex();
		SortStaff();
	}
	case 4: {
		SortStaffBirth();
		SortStaff();
	}
	case 5: {
		SortStaffPhoneNumber();
		SortStaff();
	}
	case 6: {
		SortStaffAddress();
		SortStaff();
	}
	case 7: {
		SortStaffType();
		SortStaff();
	}
	case 8: ShowStaffList();
	}
}

void Staff::OpenStaff(Staff& staff, int pos) {
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	printf("\t[STAFF SETTINGS]\n");
	OutputStaffFields();
	staff.Output();
	cout << endl;
	if (staff.getsType() == "Staff") {
		printf("[0]. Edit Staff\n");
		printf("[1]. Delete Staff\n");
		printf("[2]. Back\n");

		int num = InputNumber(0, 2);
		switch (num) {
		case 0: EditStaff(staff, pos);
		case 1: {
			lStaffs.erase(lStaffs.begin() + pos);
			ShowStaffList();
		}
		case 2: ShowStaffList();
		}
	}
	else {
		printf("[0]. Edit Staff\n");
		printf("[1]. Back\n");

		int num = InputNumber(0, 1);
		switch (num) {
		case 0: EditStaff(staff, pos);
		case 1: ShowStaffList();
		}
	}
}

void Staff::SearchStaffOption(string a) {
	system("cls");
	OutputInfor(this->getsName(), this->getsID());

	a = toLower(a);
	bool check = false;
	int num;

	printf("\t\t[SERVICE SEARCHING]");

	for (int i = 0; i < lStaffs.size(); i++) {
		if (toLower(lStaffs.at(i).getsID()).find(a) != std::string::npos
			|| toLower(lStaffs.at(i).getsName()).find(a) != std::string::npos
			|| toLower(lStaffs.at(i).getsIDCard()).find(a) != std::string::npos
			|| toLower(lStaffs.at(i).getsSex()).find(a) != std::string::npos
			|| ToString(lStaffs.at(i).getdBirth()).find(a) != std::string::npos
			|| toLower(lStaffs.at(i).getsPhoneNumber()).find(a) != std::string::npos
			|| toLower(lStaffs.at(i).getsAddress()).find(a) != std::string::npos
			|| toLower(lStaffs.at(i).getsType()).find(a) != std::string::npos
			|| toLower(lStaffs.at(i).getaAccount().getsUsername()).find(a) != std::string::npos
			|| toLower(lStaffs.at(i).getaAccount().getsPassword()).find(a) != std::string::npos) {
			check = true;
			break;
		}
	}

	if (check) {
		OutputStaffFields();
		for (int i = 0; i < lStaffs.size(); i++) {
			if (toLower(lStaffs.at(i).getsID()).find(a) != std::string::npos
				|| toLower(lStaffs.at(i).getsName()).find(a) != std::string::npos
				|| toLower(lStaffs.at(i).getsIDCard()).find(a) != std::string::npos
				|| toLower(lStaffs.at(i).getsSex()).find(a) != std::string::npos
				|| ToString(lStaffs.at(i).getdBirth()).find(a) != std::string::npos
				|| toLower(lStaffs.at(i).getsPhoneNumber()).find(a) != std::string::npos
				|| toLower(lStaffs.at(i).getsAddress()).find(a) != std::string::npos
				|| toLower(lStaffs.at(i).getsType()).find(a) != std::string::npos
				|| toLower(lStaffs.at(i).getaAccount().getsUsername()).find(a) != std::string::npos
				|| toLower(lStaffs.at(i).getaAccount().getsPassword()).find(a) != std::string::npos) {
				lStaffs.at(i).Output();
			}
		}
		cout << endl;
		printf("[0]. Select Staff\n");
		printf("[1]. Search Again\n");
		printf("[2]. Back\n");

		num = InputNumber(0, 2);
		switch (num) {
		case 0: {
			int pos = SelectStaff();
			OpenStaff(lStaffs.at(pos), pos);
		}
		case 1: {
			printf(" => Searching Staff Bar: ");
			string b;
			getline(cin, b);
			SearchStaffOption(b);
		}
		case 2: ShowStaffList();
		}
	}
	else {
		printf("\n\t\tNo Search Result\n\n");
		printf("[0]. Search Again\n");
		printf("[1]. Back\n");

		num = InputNumber(0, 1);
		switch (num) {
		case 0: {
			printf(" => Searching Staff Bar: ");
			string b;
			getline(cin, b);
			SearchStaffOption(b);
		}
		case 1: ShowStaffList();
		}
	}
}

void Staff::ShowStaffList() {
	WriteDataStaff();
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	printf("\t[STAFF LIST]\n");
	int num;
	if (StaffCount() == 0) {
		OutputStaffFields();
		for (int i = 0; i < lStaffs.size(); i++) {
			lStaffs.at(i).Output();
		}
		cout << endl;
		printf("[0]. Add Staff\n");
		printf("[1]. Select Staff\n");
		printf("[2]. Back\n");
		num = InputNumber(0, 2);

		switch (num) {
		case 0: {
			AddNewStaff();
			ShowStaffList();
		}
		case 1: {
			int pos = SelectStaff();
			OpenStaff(lStaffs.at(pos), pos);
		}
		case 2: Login();
		}
	}
	else {
		OutputStaffFields();
		for (int i = 0; i < lStaffs.size(); i++) {
			lStaffs.at(i).Output();
		}
		cout << endl;
		printf("[0]. Add Staff\n");
		printf("[1]. Select Staff\n");
		printf("[2]. Search Staff\n");
		printf("[3]. Sort Staff\n");
		printf("[4]. Reset Staff ID\n");
		printf("[5]. Back\n");
		num = InputNumber(0, 5);

		switch (num) {
		case 0: {
			AddNewStaff();
			ShowStaffList();
		}
		case 1: {
			int pos = SelectStaff();
			OpenStaff(lStaffs.at(pos), pos);
		}
		case 2: {
			printf(" => Searching Staff Bar: ");
			string a;
			getline(cin, a);
			SearchStaffOption(a);
		}
		case 3: SortStaff();
		case 4: {
			ResetStaffID();
			ShowStaffList();
		}
		case 5: Login();
		}
	}
}

//Admin_Table
void Staff::ShowTableList() {
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
		printf("[0]. Add Table\n");
		printf("[1]. Select Table\n");
		printf("[2]. Search Table\n");
		printf("[3]. Sort Table\n");
		printf("[4]. Reset Table ID\n");
		printf("[5]. Back\n");

		num = InputNumber(0, 5);

		switch (num) {
		case 0: {
			AddNewTable();
			ShowTableList();
		}
		case 1: {
			int pos = SelectTable();
			OpenTable(lTables.at(pos), pos);
		}
		case 2: {
			printf(" => Searching Table Bar: ");
			string b;
			getline(cin, b);
			SearchTableOption(b);
		}
		case 3: SortTable();
		case 4: {
			ResetTableID();
			ShowTableList();
		}
		case 5: Login();
		}
	}
	else {
		printf("\n\t\tNo Table Added\n");
		printf("\n[0]. Add Table\n");
		printf("[1]. Back\n");
		num = InputNumber(0, 1);
		switch (num) {
		case 0: {
			AddNewTable();
			ShowTableList();
		}
		case 1: Login();
		}
	}
}

void Staff::SearchTableOption(string a) {
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
			OpenTable(lTables.at(pos), pos);
		}
		case 1: {
			printf(" => Searching Table Bar: ");
			string b;
			getline(cin, b);
			SearchTableOption(b);
		}
		case 2: ShowTableList();
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
			SearchTableOption(b);
		}
		case 1: ShowTableList();
		}
	}
}

void Staff::OpenTable(Table& tb, int pos) {
	WriteDataTable();
	system("cls");
	OutputInfor(this->getsName(), this->getsID());
	printf("\t\t[TABLE SETTINGS]\n");
	cout << endl;
	cout << setw(20) << "[ID]" << setw(20) << "[STATUS]" << endl;
	tb.Output();
	cout << endl;
	printf("[0]. Order Service\n");
	printf("[1]. Edit Table Status\n");
	printf("[2]. Delete Table\n");
	printf("[3]. Back\n");

	int num = InputNumber(0, 3);
	switch (num) {
	case 0: OrderService(tb, pos);
	case 1: {
		cout << endl;
		tb.InputStatus();
		OpenTable(tb, pos);
	}
	case 2: {
		lTables.erase(lTables.begin() + pos);
		ShowTableList();
	}
	case 3: ShowTableList();
	}
}

void Staff::SortTable() {
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
		SortTable();
	}
	case 1: {
		SortTableStatus();
		SortTable();
	}
	case 2: ShowTableList();
	}
}

//Admin_Order
void Staff::OrderService(Table& tb, int pos) {
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
			MakeNewOrder(tb, pos);
			break;
		case 1:
			OpenTable(tb, pos);
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
			MakeNewOrder(tb, pos);
			break;
		case 1:
			PayOff(tb, pos);
			break;
		case 2:
			OpenTable(tb, pos);
			break;
		}
	}
}

void Staff::MakeNewOrder(Table& tb, int pos) {
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
		OrderService(tb, pos);
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
			MakeNewOrder(tb, pos);
			break;
		}
		case 1: OrderService(tb, pos);
			break;
		}
	}
}

void Staff::PayOff(Table& tb, int pos) {
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
	ShowTableList();
}
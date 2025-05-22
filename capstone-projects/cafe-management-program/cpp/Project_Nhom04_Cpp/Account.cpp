#include "Library.h"

std::string Account::getsUsername() {
	return sUsername;
}

void Account::setsUsername(std::string sUsername) {
	this->sUsername = sUsername;
}

std::string Account::getsPassword() {
	return sPassword;
}

void Account::setsPassword(std::string sPassword) {
	this->sPassword = sPassword;
}

Account::Account() {
}

Account::~Account() {
}

Account::Account(std::string username, std::string password) {
	this->sUsername = username;
	this->sPassword = password;
}

//Input
void Account::InputUsername() {
	printf("Username: ");
	this->sUsername = toLower(InputString());
}

void Account::InputPassword() {
	printf("Password: ");
	this->sPassword = InputString();
}

void Account::Input() {
	InputUsername();
	InputPassword();
}

void Account::AddUsername() {
	printf("Username: ");
	std::string username = toLower(InputString());
	while (IsExist(username)) {
		printf("\n\t\tUsername Is Used. Please Type Another Username!\n");
		printf("Username: ");
		username = toLower(InputString());
	}
	this->setsUsername(username);
}

void Account::AddAccount() {
	AddUsername();
	InputPassword();
}

//Methods
bool IsExist(std::string username) {
	for (int i = 0; i < lStaffs.size(); i++) {
		if (toLower(username) == toLower(lStaffs.at(i).getaAccount().getsUsername()))
			return true;
	}
	return false;
}

bool IsExist(Account account) {
	for (int i = 0; i < lStaffs.size(); i++) {
		if (IsEqual(account, lStaffs.at(i).getaAccount()))
			return true;
	}
	return false;
}

void AccessLogin(Account login) {
	for (int i = 0; i < lStaffs.size(); i++) {
		if (IsEqual(login, lStaffs.at(i).getaAccount())) {
			if (!IsDate(nDate.getiDay(), nDate.getiMonth(), nDate.getiYear()))
				InputDate(lStaffs.at(i).getsName(), lStaffs.at(i).getsID());
			if (lStaffs.at(i).getsType() == "Staff")
				lStaffs.at(i).LoginStaff();
			else
				lStaffs.at(i).Login();
		}
	}
}

//Operator
bool IsEqual(Account a, Account b) {
	return (toLower(a.getsUsername()) == toLower(b.getsUsername())) && (a.getsPassword() == b.getsPassword());
}

bool IsNotEqual(Account a, Account b) {
	return !(IsEqual(a, b));
}
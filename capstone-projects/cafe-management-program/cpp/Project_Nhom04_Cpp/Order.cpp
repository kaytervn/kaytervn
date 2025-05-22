#include "Library.h"

//properties
string Order::getsServiceName() {
	return sServiceName;
}

void Order::setsServiceName(string sServiceName) {
	this->sServiceName = sServiceName;
}

int Order::getiAmount() {
	return iAmount;
}

void Order::setiAmount(int iAmount) {
	this->iAmount = iAmount;
}

double Order::getdPrice() {
	return dPrice;
}

void Order::setdPrice(double dPrice) {
	this->dPrice = dPrice;
}

double Order::getdCost() {
	return dCost;
}

void Order::setdCost(double dCost) {
	this->dCost = dCost;
}

//contructor
Order::Order() {
}

Order::Order(string servicename, int amount, double price, double cost) {
	sServiceName = servicename;
	iAmount = amount;
	dPrice = price;
	dCost = cost;
}

//Inputs
void Order::InputAmount(int pos) {
	cout << "Amount To Order: " << endl;
	iAmount = InputNumber(1, lServices.at(pos).getiAmount());
	lServices.at(pos).setiAmount(lServices.at(pos).getiAmount() - iAmount);
}

//Output
void Order::Output(vector<Order> loders) {

	cout << setw(PadRightMaxOrder(loders)) <<
		this->sServiceName << setw(PadRightMaxOrder(loders)) <<
		to_string(this->iAmount) << setw(PadRightMaxOrder(loders)) <<
		to_string(this->dPrice) << setw(PadRightMaxOrder(loders)) <<
		to_string(this->dCost) << endl;
}

void OutputOrderFields(vector<Order> loders) {
	cout << endl;
	cout << setw(PadRightMaxOrder(loders)) <<
		"[SERVICE NAME]" << setw(PadRightMaxOrder(loders)) <<
		"[AMOUNT]" << setw(PadRightMaxOrder(loders)) <<
		"[PRICE]" << setw(PadRightMaxOrder(loders)) <<
		"[COST]" << endl;
}

//Methods
int Order::FindPadRight() {
	int max = 1;
	while (sServiceName.length() > max
		|| to_string(iAmount).length() > max
		|| to_string(dPrice).length() > max
		|| to_string(dCost).length() > max) {
		max++;
	}
	return max;
}

int PadRightMaxOrder(vector<Order> lOrder) {
	int len = lOrder.at(0).FindPadRight();
	for (int i = 1; i < lOrder.size(); i++) {
		if (lOrder.at(i).FindPadRight() > len)
			len = lOrder.at(i).FindPadRight();
	}
	return len + 10;
}

int SelectServiceOrder() {
	string id;
	int pos;
	do {
		try {
			cout << " => Now Enter Service ID: ";
			getline(cin, id);
			pos = SearchService(id);
			if (pos == -1 || lServices.at(pos).getiAmount() == 0)
				continue;
			else
				break;
		}
		catch (exception e) {
			continue;
		}
	} while (true);
	return pos;
}

void Order::CalsCost() {
	dCost = dPrice * iAmount;
}
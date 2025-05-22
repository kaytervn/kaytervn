#include "Library.h"

string Cafe::getsCafename() {
    return this->sCafename;
}

void Cafe::setsCafename(string cafename) {
    this->sCafename = cafename;
}

string Cafe::getsOwner() {
    return this->sOwner;
}

void Cafe::setsOwner(string Owner) {
    this->sOwner = Owner;
}

string Cafe::getsAddress() {
    return this->sAddress;
}

void Cafe::setsAddress(string Address) {
    this->sAddress = Address;
}

double Cafe::getdTotal() {
    return this->dTotal;
}

void Cafe::setdTotal(double Total)
{
    this->dTotal = Total;
}
#include "Library.h"

int Time::getiHour() {
    return iHour;
}

void Time::setiHour(int iHour) {
    this->iHour = iHour;
}

int Time::getiMinute() {
    return iMinute;
}

void Time::setiMinute(int iMinute) {
    this->iMinute = iMinute;
}

int Time::getiSecond() {
    return iSecond;
}

void Time::setiSecond(int iSecond) {
    this->iSecond = iSecond;
}

Time::Time() {

};

void Time::Input() {
    std::string a;
    Time b;
    while (true) {
        try {
            cout << "Time [hh:mm:ss]: ";
            getline(cin, a);

            b = ToTime(a);
            if (!IsTime(b.iHour, b.iMinute, b.iSecond))
                continue;
            else
            {
                this->iHour = b.iHour;
                this->iMinute = b.iMinute;
                this->iSecond = b.iSecond;
                break;
            }
        }
        catch (exception e) {
            continue;
        }
    }
}

void Time::Output() {
    cout << to_string(this->iHour) + ":" + to_string(this->iMinute) + ":" + to_string(this->iSecond);
}

bool Time::IsTime(int Hour, int Minute, int Second) {
    return Hour >= 0 && Hour <= 23 && Minute >= 0 && Minute <= 59 && Second >= 0 && Second <= 59;
}

bool IsMore(Time a, Time b) {
    if (a.getiHour() > b.getiHour())
        return true;
    else if (a.getiHour() < b.getiHour())
        return false;

    if (a.getiMinute() > b.getiMinute())
        return true;
    else if (a.getiMinute() < b.getiMinute())
        return false;

    return a.getiSecond() > b.getiSecond();
}

string ToString(Time a) {
    string tg = "";
    tg += to_string(a.getiHour()) + ":" + to_string(a.getiMinute()) + ":" + to_string(a.getiSecond());
    return tg;
}

Time ToTime(std::string a) {
    Time d;
    string split[MAX];
    SplitString(split, a, ':');
    d.setiHour(stoi(split[0]));
    d.setiMinute(stoi(split[1]));
    d.setiSecond(stoi(split[2]));
    return d;
}
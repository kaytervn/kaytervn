#include<iostream>
#include<cmath>
using namespace std;

void nhap(int &k, double &qt, double &t);
void xuat(bool kq);
bool xuLy(int &k, double &qt, double &t);

int main()
{
	int k;
	double qt, t;
	nhap(k,qt,t);
	bool kq=xuLy(k,qt,t);
	xuat(kq);
	return 0;
}

bool xuLy(int &k, double &qt, double &t)
{
	double tb,c;
	tb=(qt+t)/2;
	c=roundf(tb*10)/10;
	if(k==21)
		if(c>=4.0)
			return 1;
		else
			return 0;
	else
		if(c>=5.0)
			return 1;
		else
			return 0;

}

void nhap(int &k, double &qt, double &t)
{
	cin>>k>>qt>>t;
}

void xuat(bool kq)
{
	if(kq==1)
		cout<<"Pass";
	else
		cout<<"Fail";
}

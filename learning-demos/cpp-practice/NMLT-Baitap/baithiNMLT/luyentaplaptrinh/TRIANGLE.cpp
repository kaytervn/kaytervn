#include<bits/stdc++.h>
 
using namespace std;
 
int max(int a, int b){
	if (a>b) return a;
	else return b;
}
 
int main(){
	int a, b, c;
	cin>>a>>b>>c;
 
	int Sum = a+b+c;
	int Max = max(a, max(b, c));
 
	cout<<max(0, Max-(Sum-Max)+1);
}

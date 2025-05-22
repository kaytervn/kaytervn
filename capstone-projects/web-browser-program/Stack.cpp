#include"Prototype.h"

void InitStack(Stack &A) {
	A.top = -1;
}

bool StackIsFull(Stack A) {
	return (A.top == MAX);
}

bool StackIsEmpty(Stack A) {
	return (A.top == -1);
}

void Push(Stack &A, TabGroup g) {
	if(!StackIsFull(A)) {
		A.top++;
		GroupAssignValue(A.arr[A.top],g);
	} else
		return;
}

TabGroup Pop(Stack &A) {
	TabGroup tmp;
	GroupAssignValue(tmp,A.arr[A.top]);
	if(!StackIsEmpty(A))
		A.top--;
	return tmp;
}

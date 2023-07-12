// A file in which I experiment with struct packing tricks

#include <stdlib.h>

typedef struct {
	int a;
	int b;
} StructA;

typedef struct {
	int x;
	int y;
	int z;
} StructB;

int main() {
	StructA *a;
	StructB *b;

	a = malloc(sizeof(StructA) + sizeof(StructB));
	b = (StructB *) &a[1];

	a->a = 0;
	a->b = 1;

	
	b->x = 2;
	b->y = 3;
	b->z = 4;

	return 0;
}

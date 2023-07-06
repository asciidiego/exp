.global _main

.section __TEXT,__text

.align 2
_main:
	sub sp, sp, #32			; decrement stack pointer. that is, allocate 16 bytes on stack

	str x29, [sp, #0]		; store the frame pointer (x29) at [sp] (stack pointer)
	str x30, [sp, #8]		; store the link register (x29) at [sp + 8] (stack pointer)

	mov x0, 7			; move number 3 into register
	str x0, [sp, #16]		; store 3 in stack

	ldr x29, [sp, #0]		; load the frame pointer from the stack
	ldr x30, [sp, #8]		; load the link register from the stack

	add sp, sp, #32			; increment stack pointer

	ret
	

/* fault_table.h */
#ifndef FAULT_TABLE_H
#define FAULT_TABLE_H
#include <stdbool.h>
bool Fault_Active(void);
void Fault_Log(uint16_t id);
#endif

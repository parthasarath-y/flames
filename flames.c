#include <stdio.h>
#include <string.h>
#include <ctype.h>

int name_count(char str1[], char str2[]) {
    int len1 = strlen(str1);
    int len2 = strlen(str2);
    int common = 0;
    for(int i = 0; i < len1; i++) str1[i] = tolower(str1[i]);
    for(int i = 0; i < len2; i++) str2[i] = tolower(str2[i]);

    //The crossing off logic
    for(int i = 0; i < len1; i++) {
        for(int k = 0; k < len2; k++) {
                        if(str1[i] == str2[k] && str1[i] != '*') { 
                str1[i] = '*';
                str2[k] = '*';
                common += 2;  
                break;        
            }
        }
      } 
  return (len1 + len2) - common;
}
int result_letter(int count) {
    char flames[] = "FLAMES",final_letter;
    int fc = 6, pos = 0;

    if (count == 0) return "onn podey";

    for (int i = 0; i < 5; i++) {
        int step = 0;
        while (step < count) {
            if (flames[pos % fc] != 'X') {
                step++;
            }
            if (step < count) {
                pos++;
            }
        }
        flames[pos % fc] = 'X';
        while (flames[pos % fc] == 'X') {
            pos++;
        }
    }
    for (int i = 0; i < fc; i++) {
        if (flames[i] != 'X') {
            final_letter=flames[i];

        }
    }
  
  return final_letter;
}
const char* verdict(char lett) {
    switch (lett) {
        case 'F': return "Friendship";
        case 'L': return "Love";
        case 'A': return "Affection";
        case 'M': return "Marriage";
        case 'E': return "Enemy";
        case 'S': return "Siblings";
        default:  return "Unknown";
    }
}
int main() {
    char name1[30], name2[30];
    printf("Enter your name: ");
    scanf("%s", name1);
    printf("Enter their name: ");
    scanf("%s", name2);

    int num_c = name_count(name1, name2);    
    char letter=result_letter(num_c);
    const char* final_result=verdict(letter);
    printf("%s",final_result);
    
    
  return 0;
}
'use client'

import { memo, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, LogOut, Plus } from 'lucide-react'

import { ProfileAvatar } from '@/entities/profile'
import { UserAvatar } from '@/entities/user'
import { useCurrentRole } from '@/shared/hooks/useCurrentRole'
import {
  useCurrentUser,
  useCurrentUserImage,
  useCurrentUserName,
} from '@/shared/hooks/useCurrentUser'
import { cn } from '@/shared/lib/cn'
import { Container } from '@/shared/ui/Container'

const NAV_LINKS = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/events', label: 'События' },
  { href: '/about', label: 'О проекте' },
  { href: '/contacts', label: 'Контакты' },
] as const

const CaucasusLogo = () => (
  <svg
    viewBox="311 239 1240 388"
    width="130"
    height="41"
    aria-hidden="true"
    style={{ display: 'block' }}
  >
    <path
      fill="#1C5232"
      fillRule="evenodd"
      d="M1181 519 L1163 519 L1163 520 L1166 520 L1170 523 L1170 527 L1169 528 L1167 536 L1165 539 L1165 541 L1163 544 L1162 549 L1159 555 L1157 554 L1155 550 L1155 548 L1153 545 L1153 543 L1151 540 L1151 538 L1149 535 L1149 533 L1146 527 L1146 522 L1149 520 L1152 520 L1152 519 L1129 519 L1128 520 L1133 521 L1136 524 L1136 526 L1138 529 L1138 531 L1141 536 L1141 538 L1144 543 L1144 545 L1147 550 L1147 552 L1149 555 L1149 557 L1154 567 L1153 571 L1151 574 L1151 576 L1148 581 L1148 583 L1143 588 L1134 588 L1132 591 L1132 595 L1134 597 L1141 597 L1148 589 L1149 585 L1154 575 L1154 573 L1159 563 L1159 561 L1161 558 L1162 553 L1166 546 L1166 544 L1168 541 L1168 539 L1170 536 L1170 534 L1173 529 L1173 527 L1174 525 Z M1044 522 L1039 527 L1038 529 L1038 532 L1040 534 L1044 534 L1047 530 L1047 525 L1048 523 L1053 520 L1055 520 L1056 521 L1058 521 L1062 525 L1062 527 L1063 528 L1063 539 L1061 541 L1052 543 L1040 549 L1037 553 L1037 561 L1038 563 L1041 566 L1043 567 L1047 567 L1048 568 L1049 567 L1055 566 L1062 561 L1064 562 L1065 565 L1067 567 L1074 567 L1081 563 L1079 562 L1076 563 L1072 560 L1072 529 L1071 528 L1071 525 L1070 523 L1067 520 L1063 518 L1053 518 L1052 519 L1050 519 Z M1062 542 L1063 543 L1063 558 L1061 560 L1057 562 L1055 562 L1054 563 L1050 562 L1046 558 L1046 556 L1045 555 L1046 551 L1050 547 L1058 543 Z M993 522 L993 524 L997 524 L1000 527 L1000 536 L1001 537 L1001 539 L1000 540 L1000 562 L997 565 L994 565 L995 566 L1018 566 L1018 565 L1014 565 L1012 564 L1009 560 L1009 531 L1012 527 L1013 527 L1017 524 L1019 524 L1023 528 L1027 528 L1029 527 L1030 525 L1030 522 L1029 520 L1027 518 L1020 518 L1015 522 L1014 522 L1011 526 L1009 525 L1009 518 L1006 518 L1005 519 L1003 519 L1002 520 L1000 520 L996 522 Z M919 518 L916 518 L910 521 L907 521 L903 523 L903 524 L907 524 L910 527 L910 562 L907 565 L903 565 L903 566 L926 566 L926 565 L923 565 L921 564 L919 561 Z M1122 519 L1120 518 L1114 518 L1110 520 L1105 525 L1103 524 L1103 519 L1101 517 L1096 520 L1088 522 L1088 524 L1092 525 L1094 528 L1094 562 L1091 565 L1088 565 L1087 566 L1112 566 L1111 565 L1107 565 L1103 562 L1103 531 L1104 529 L1108 525 L1110 525 L1111 524 L1114 525 L1117 528 L1121 528 L1124 524 L1124 522 Z M913 492 L909 495 L909 501 L910 503 L912 504 L916 504 L919 501 L920 497 L917 493 Z M837 490 L838 491 L842 491 L844 492 L846 494 L846 496 L847 497 L847 558 L846 559 L846 561 L842 565 L838 565 L837 566 L892 566 L893 564 L893 560 L894 559 L894 555 L895 554 L895 551 L896 550 L896 548 L895 547 L891 555 L885 561 L881 563 L878 563 L877 564 L862 564 L861 563 L859 563 L857 561 L857 559 L856 558 L856 497 L858 493 L862 491 L866 491 L867 490 Z M947 484 L946 485 L944 485 L943 486 L941 486 L940 487 L932 489 L933 491 L936 491 L939 494 L939 563 L938 564 L938 566 L939 567 L943 564 L945 564 L948 566 L951 566 L952 567 L965 567 L966 566 L971 565 L973 563 L974 563 L981 556 L984 550 L984 547 L985 546 L985 535 L984 534 L984 531 L981 527 L981 526 L975 520 L971 519 L970 518 L960 518 L959 519 L957 519 L953 521 L950 524 L948 523 L948 484 Z M955 523 L963 523 L967 525 L972 530 L975 536 L976 546 L975 547 L975 552 L974 553 L974 555 L972 559 L967 564 L965 565 L956 565 L954 564 L948 558 L948 528 L951 525 Z M413 445 L440 445 L430 445 L429 444 L427 445 L425 444 L419 444 L418 445 L414 444 Z M1363 384 L1363 386 L1371 386 L1375 391 L1375 435 L1376 436 L1376 440 L1377 441 L1378 446 L1383 452 L1389 455 L1391 455 L1392 456 L1404 456 L1405 455 L1410 454 L1412 452 L1415 451 L1426 442 L1428 443 L1428 453 L1430 456 L1433 456 L1434 455 L1436 455 L1437 454 L1439 454 L1440 453 L1442 453 L1443 452 L1445 452 L1449 450 L1452 450 L1456 448 L1456 446 L1453 446 L1452 447 L1447 447 L1445 446 L1442 442 L1442 377 L1441 375 L1435 376 L1432 378 L1430 378 L1427 380 L1425 380 L1424 381 L1422 381 L1421 382 L1419 382 L1415 384 L1416 386 L1423 386 L1427 391 L1427 437 L1420 443 L1416 445 L1414 445 L1413 446 L1408 446 L1407 447 L1401 446 L1397 444 L1392 439 L1392 437 L1390 433 L1390 376 L1389 375 L1386 375 L1380 378 L1378 378 L1375 380 L1373 380 L1372 381 L1370 381 L1369 382 L1367 382 Z M1029 384 L1029 386 L1037 386 L1041 391 L1041 437 L1042 438 L1042 442 L1045 448 L1049 452 L1057 456 L1069 456 L1070 455 L1073 455 L1079 452 L1085 447 L1086 447 L1091 442 L1093 442 L1094 443 L1094 453 L1096 456 L1098 456 L1099 455 L1102 455 L1103 454 L1105 454 L1106 453 L1108 453 L1109 452 L1111 452 L1115 450 L1121 449 L1123 447 L1122 446 L1114 447 L1112 446 L1108 441 L1108 376 L1107 375 L1104 375 L1096 379 L1094 379 L1093 380 L1091 380 L1090 381 L1088 381 L1087 382 L1085 382 L1081 384 L1082 386 L1089 386 L1092 389 L1092 391 L1093 392 L1093 437 L1087 442 L1081 445 L1079 445 L1078 446 L1067 446 L1063 444 L1058 439 L1057 435 L1056 434 L1056 376 L1055 375 L1052 375 L1049 377 L1041 379 L1038 381 L1036 381 L1035 382 L1033 382 Z M1509 375 L1504 375 L1503 374 L1492 374 L1491 375 L1487 375 L1486 376 L1481 377 L1474 383 L1474 384 L1471 388 L1471 390 L1470 391 L1470 402 L1471 403 L1472 407 L1475 410 L1476 410 L1479 414 L1487 418 L1489 420 L1498 424 L1501 427 L1502 427 L1506 431 L1508 435 L1508 437 L1509 438 L1509 442 L1508 443 L1508 445 L1507 447 L1503 451 L1499 453 L1489 453 L1483 450 L1477 444 L1471 433 L1471 431 L1469 429 L1468 430 L1469 451 L1473 453 L1475 453 L1476 454 L1478 454 L1482 456 L1487 456 L1488 457 L1496 457 L1497 456 L1502 456 L1503 455 L1505 455 L1511 452 L1517 446 L1520 440 L1520 437 L1521 436 L1521 430 L1520 429 L1519 423 L1517 421 L1517 420 L1511 414 L1506 412 L1504 410 L1490 403 L1483 396 L1482 394 L1482 391 L1481 390 L1482 388 L1482 385 L1486 380 L1490 378 L1499 378 L1500 379 L1504 380 L1511 387 L1514 393 L1514 395 L1516 396 L1517 395 L1517 392 L1516 391 L1516 378 L1515 377 L1513 377 Z M1336 374 L1322 374 L1321 375 L1315 376 L1308 380 L1305 383 L1305 384 L1302 388 L1302 390 L1301 391 L1301 400 L1302 401 L1302 404 L1303 406 L1308 412 L1309 412 L1317 418 L1328 423 L1338 432 L1339 436 L1340 437 L1340 442 L1339 443 L1339 445 L1338 447 L1333 452 L1331 453 L1320 453 L1313 449 L1308 444 L1300 429 L1299 430 L1299 438 L1300 439 L1300 450 L1304 453 L1306 453 L1310 455 L1313 455 L1314 456 L1319 456 L1320 457 L1326 457 L1327 456 L1332 456 L1333 455 L1336 455 L1343 451 L1348 446 L1348 445 L1351 441 L1351 439 L1352 438 L1352 428 L1351 427 L1351 424 L1347 419 L1347 418 L1339 412 L1334 410 L1332 408 L1325 405 L1323 403 L1319 401 L1314 396 L1314 394 L1313 393 L1313 385 L1317 380 L1321 378 L1330 378 L1331 379 L1335 380 L1342 387 L1342 388 L1345 392 L1346 396 L1348 396 L1348 385 L1347 384 L1347 378 L1344 376 L1342 376 L1341 375 L1337 375 Z M1224 384 L1219 390 L1219 392 L1218 393 L1218 397 L1219 399 L1221 400 L1228 400 L1230 399 L1232 395 L1232 388 L1234 384 L1238 380 L1242 379 L1243 378 L1248 378 L1252 380 L1256 384 L1258 388 L1258 391 L1259 392 L1259 410 L1256 412 L1254 412 L1253 413 L1245 415 L1242 417 L1234 419 L1221 426 L1216 433 L1216 436 L1215 437 L1215 442 L1216 443 L1216 446 L1218 450 L1221 453 L1225 455 L1227 455 L1228 456 L1238 456 L1239 455 L1242 455 L1251 450 L1258 444 L1260 445 L1261 451 L1265 455 L1267 456 L1274 456 L1286 450 L1289 447 L1288 445 L1284 447 L1279 448 L1274 444 L1274 441 L1273 440 L1273 389 L1272 388 L1272 385 L1270 383 L1270 382 L1265 377 L1263 376 L1261 376 L1257 374 L1247 374 L1246 375 L1243 375 L1242 376 L1236 377 L1230 380 L1225 384 Z M1258 415 L1259 416 L1259 439 L1255 443 L1248 447 L1244 447 L1243 448 L1241 448 L1240 447 L1237 447 L1235 445 L1234 445 L1232 443 L1231 439 L1230 438 L1230 433 L1231 432 L1232 428 L1237 423 L1249 417 L1251 417 L1255 415 Z M1168 374 L1167 375 L1159 376 L1151 380 L1149 382 L1148 382 L1138 392 L1137 395 L1135 397 L1135 399 L1133 402 L1132 408 L1131 409 L1131 425 L1132 426 L1132 429 L1133 430 L1133 432 L1134 433 L1135 437 L1137 439 L1139 443 L1145 449 L1154 454 L1160 455 L1161 456 L1177 456 L1178 455 L1184 454 L1192 450 L1200 443 L1201 439 L1199 439 L1193 444 L1191 444 L1185 447 L1170 447 L1169 446 L1166 446 L1159 442 L1154 437 L1154 436 L1150 431 L1148 427 L1148 425 L1147 424 L1147 420 L1146 419 L1146 401 L1147 400 L1147 397 L1148 396 L1148 394 L1151 388 L1158 381 L1162 379 L1164 379 L1165 378 L1173 378 L1179 381 L1182 385 L1185 393 L1190 396 L1196 395 L1199 392 L1199 385 L1198 383 L1193 378 L1189 376 L1186 376 L1185 375 L1182 375 L1181 374 Z M964 381 L962 383 L961 383 L954 391 L954 397 L957 400 L963 400 L967 397 L967 390 L968 389 L968 387 L970 383 L972 381 L973 381 L975 379 L983 378 L984 379 L988 380 L992 384 L993 386 L994 392 L995 393 L995 409 L993 411 L988 412 L985 414 L983 414 L982 415 L974 417 L971 419 L969 419 L966 421 L964 421 L960 423 L957 426 L956 426 L951 433 L951 437 L950 438 L950 440 L951 441 L951 445 L953 449 L958 454 L962 455 L963 456 L974 456 L975 455 L977 455 L988 449 L993 444 L994 444 L996 446 L996 449 L997 451 L1001 455 L1003 456 L1010 456 L1023 449 L1025 447 L1024 445 L1020 447 L1017 447 L1015 448 L1013 447 L1009 442 L1009 390 L1008 389 L1008 386 L1006 382 L999 376 L993 375 L992 374 L983 374 L982 375 L978 375 L977 376 L972 377 Z M994 414 L995 415 L995 439 L992 442 L983 447 L980 447 L978 448 L977 447 L973 447 L971 446 L967 442 L966 440 L966 437 L965 436 L966 434 L966 431 L968 427 L972 423 L984 417 L986 417 L987 416 L989 416 L990 415 Z M459 400 L460 401 L460 407 L507 373 L516 368 L568 405 L571 409 L569 410 L522 378 L525 384 L538 401 L538 403 L536 404 L522 401 L554 427 L588 451 L562 422 L563 421 L625 444 L624 441 L596 419 L593 415 L627 395 L632 399 L641 410 L641 412 L638 413 L637 415 L647 419 L651 419 L687 433 L695 435 L682 425 L683 423 L690 421 L697 428 L703 430 L712 436 L725 439 L695 417 L690 415 L686 417 L678 418 L633 389 L628 387 L619 391 L596 406 L588 409 L532 368 L515 358 Z M835 337 L827 345 L827 346 L822 352 L815 367 L815 370 L813 375 L813 382 L812 383 L812 394 L813 395 L813 401 L814 402 L815 410 L819 420 L827 432 L834 439 L835 439 L839 443 L842 444 L847 448 L851 450 L853 450 L856 452 L862 453 L863 454 L866 454 L867 455 L872 455 L873 456 L898 456 L899 455 L904 455 L905 454 L909 454 L910 453 L917 452 L918 451 L925 449 L928 446 L928 442 L929 441 L929 437 L930 436 L930 431 L931 430 L931 426 L932 425 L932 419 L930 419 L929 420 L929 422 L921 436 L913 444 L907 448 L903 449 L900 451 L897 451 L896 452 L890 452 L889 453 L877 452 L876 451 L873 451 L870 449 L868 449 L858 443 L846 431 L838 417 L838 415 L835 408 L835 405 L834 404 L834 400 L833 399 L833 393 L832 392 L832 379 L833 378 L833 370 L834 369 L834 365 L835 364 L837 356 L842 346 L845 343 L845 342 L858 330 L862 328 L870 326 L871 325 L877 325 L878 324 L886 324 L887 325 L892 325 L893 326 L899 327 L910 333 L918 341 L918 342 L921 345 L926 355 L926 357 L928 358 L929 357 L929 346 L928 345 L928 333 L927 332 L927 330 L925 328 L921 327 L918 325 L916 325 L912 323 L909 323 L908 322 L904 322 L903 321 L897 321 L896 320 L875 320 L874 321 L869 321 L868 322 L861 323 L855 326 L853 326 L845 330 L836 337 Z M426 318 L425 320 L425 335 L433 337 L433 321 L430 318 Z M373 312 L377 317 L375 368 L355 563 L343 566 L342 571 L519 571 L566 578 L573 581 L575 589 L620 589 L625 579 L666 572 L781 571 L753 454 L698 443 L645 448 L617 460 L597 476 L572 457 L538 444 L496 438 L462 441 L463 449 L499 447 L540 454 L583 475 L593 484 L596 492 L597 550 L599 487 L618 470 L647 457 L676 452 L701 452 L738 458 L743 462 L759 538 L717 532 L661 536 L625 549 L597 570 L577 553 L548 539 L510 530 L470 529 L470 534 L528 539 L562 553 L518 542 L471 541 L471 546 L516 547 L549 556 L484 550 L472 551 L472 561 L467 562 L449 367 L448 317 L453 312 L413 269 Z M633 562 L633 561 L636 559 L642 558 L643 557 L649 556 L650 555 L653 555 L654 554 L657 554 L658 553 L661 553 L662 552 L666 552 L667 551 L673 551 L674 550 L685 550 L686 549 L720 549 L721 550 L733 550 L734 551 L742 551 L743 552 L748 552 L749 553 L761 554 L763 555 L765 558 L764 560 L760 560 L759 559 L753 559 L752 558 L746 558 L745 557 L738 557 L737 556 L727 556 L726 555 L712 555 L711 554 L687 554 L686 555 L673 555 L672 556 L657 557 L656 558 L648 559 L647 560 L644 560 L643 561 L640 561 L639 562 L636 562 L635 563 Z M442 547 L443 546 L457 546 L460 549 L460 561 L459 562 L454 562 L453 561 L444 561 L443 560 L443 557 L442 556 Z M763 548 L762 550 L759 550 L758 549 L754 549 L753 548 L747 548 L746 547 L740 547 L739 546 L731 546 L730 545 L721 545 L720 544 L685 544 L684 545 L674 545 L673 546 L668 546 L667 547 L662 547 L661 548 L652 549 L651 550 L648 550 L647 551 L645 551 L644 552 L636 554 L624 560 L622 559 L623 557 L628 555 L630 553 L634 552 L641 548 L646 547 L649 545 L652 545 L656 543 L659 543 L660 542 L663 542 L664 541 L668 541 L669 540 L674 540 L675 539 L682 539 L683 538 L694 538 L695 537 L729 538 L730 539 L744 540 L745 541 L750 541 L751 542 L760 543 L762 545 L762 547 Z M406 517 L409 515 L419 515 L420 516 L422 515 L439 515 L440 516 L455 516 L457 518 L457 525 L458 526 L458 530 L457 531 L454 531 L457 531 L458 532 L458 537 L459 538 L459 545 L458 546 L452 546 L450 544 L448 546 L443 546 L441 544 L441 531 L442 530 L450 530 L449 528 L448 530 L437 530 L435 528 L432 530 L424 530 L427 530 L428 531 L428 544 L426 546 L424 546 L427 546 L429 548 L429 560 L428 561 L406 561 L405 560 L405 548 L407 546 L414 546 L415 545 L417 545 L418 546 L419 545 L421 545 L419 545 L418 544 L417 545 L406 545 L405 544 L405 535 L406 534 L406 531 L407 530 L414 530 L414 529 L407 529 L406 528 Z M406 489 L408 487 L436 487 L437 488 L453 488 L455 490 L455 502 L454 503 L456 504 L456 510 L457 511 L457 515 L456 516 L450 516 L449 515 L447 516 L441 516 L440 515 L428 515 L426 513 L426 512 L426 514 L425 515 L414 515 L413 514 L412 515 L407 515 L406 514 L406 503 L408 501 L406 500 Z M407 474 L408 473 L434 473 L435 474 L436 473 L439 473 L440 474 L452 474 L454 476 L454 487 L453 488 L448 488 L447 487 L445 488 L441 488 L440 487 L436 487 L435 486 L434 487 L423 487 L421 485 L420 487 L408 487 L407 486 Z M388 461 L389 462 L389 469 L388 470 L388 486 L387 488 L385 489 L384 488 L384 469 L385 467 L384 466 L383 467 L380 467 L379 465 L384 462 Z M407 433 L409 431 L426 431 L427 432 L445 432 L446 433 L449 433 L451 435 L451 445 L450 446 L446 446 L445 445 L442 446 L450 446 L452 448 L452 459 L451 460 L453 462 L453 473 L452 474 L447 474 L446 473 L436 473 L435 472 L433 473 L430 473 L428 471 L426 473 L417 473 L416 472 L414 472 L413 473 L409 473 L407 471 L407 460 L408 459 L415 459 L416 458 L408 458 L407 457 L407 447 L409 445 L410 445 L409 445 L407 443 Z M391 393 L392 394 L392 397 L391 398 L391 416 L389 418 L388 418 L387 417 L387 398 L385 398 L384 396 L389 393 Z M410 354 L415 354 L416 355 L422 355 L423 356 L426 356 L428 360 L430 357 L437 357 L438 358 L443 358 L445 360 L445 365 L444 366 L436 366 L434 365 L436 366 L443 366 L446 369 L446 377 L445 378 L443 377 L439 377 L438 376 L437 377 L435 377 L439 377 L440 378 L442 377 L443 378 L445 378 L447 381 L447 390 L446 391 L443 391 L441 389 L441 388 L441 390 L439 391 L445 391 L448 394 L448 404 L447 405 L443 405 L441 403 L440 404 L434 404 L442 404 L443 405 L447 405 L449 407 L449 418 L448 419 L445 419 L444 418 L433 418 L443 418 L444 419 L448 419 L450 421 L450 431 L449 432 L444 432 L443 431 L442 432 L436 432 L434 430 L434 429 L433 431 L420 431 L419 430 L417 431 L409 431 L408 430 L408 418 L409 417 L431 417 L430 416 L429 417 L418 417 L416 415 L414 417 L412 417 L408 415 L408 404 L410 402 L415 402 L416 403 L418 402 L420 402 L421 403 L427 403 L421 403 L419 401 L418 402 L409 402 L408 401 L408 391 L410 389 L426 389 L427 390 L434 390 L430 390 L429 389 L418 389 L417 388 L415 389 L410 389 L408 387 L408 385 L409 384 L409 377 L410 376 L427 376 L428 377 L430 377 L430 376 L419 376 L418 375 L417 376 L410 376 L409 375 L409 365 L410 364 L421 364 L410 363 L409 362 L409 355 Z M398 332 L400 333 L400 341 L399 342 L397 341 L397 333 Z M387 330 L388 331 L388 344 L391 343 L392 345 L389 347 L385 348 L384 347 L385 345 L385 331 Z M385 318 L388 316 L390 316 L391 315 L393 315 L396 313 L400 312 L401 313 L400 315 L400 329 L399 330 L397 329 L397 316 L396 317 L394 317 L393 318 L391 318 L387 320 L386 320 Z M412 308 L416 308 L417 309 L420 309 L421 310 L424 310 L425 311 L428 311 L429 312 L436 313 L437 314 L442 315 L444 317 L444 330 L445 331 L445 349 L446 350 L446 353 L445 354 L438 354 L437 353 L433 353 L431 351 L431 346 L426 346 L426 350 L424 352 L422 351 L415 351 L414 350 L411 350 L410 349 L410 339 L411 338 L410 336 L410 334 L411 333 L410 332 L410 321 L411 320 L411 309 Z M411 298 L413 296 L414 296 L417 298 L422 298 L423 299 L427 299 L428 300 L436 301 L438 302 L441 305 L441 306 L440 307 L437 307 L436 306 L430 305 L429 304 L427 304 L426 303 L424 303 L420 301 L412 300 Z M412 289 L413 288 L425 289 L429 293 L429 294 L427 295 L426 294 L420 293 L419 292 L413 292 L412 291 Z"
    />
    <path
      fill="#D4A53A"
      fillRule="evenodd"
      d="M734 513 L730 513 L729 512 L726 512 L725 511 L710 510 L709 509 L677 509 L676 510 L670 510 L669 511 L663 511 L662 512 L658 512 L657 513 L654 513 L653 514 L650 514 L646 516 L640 517 L637 519 L635 519 L623 525 L616 530 L616 531 L613 534 L613 538 L614 538 L622 532 L634 526 L636 526 L639 524 L641 524 L644 522 L646 522 L650 520 L653 520 L657 518 L661 518 L662 517 L665 517 L666 516 L672 516 L673 515 L678 515 L679 514 L687 514 L688 513 L698 513 L699 512 L720 512 L721 513 Z M475 507 L477 508 L497 508 L498 509 L504 509 L505 510 L512 510 L513 511 L516 511 L517 512 L521 512 L522 513 L525 513 L526 514 L529 514 L530 515 L537 516 L545 520 L548 520 L551 522 L553 522 L556 524 L558 524 L568 529 L578 536 L581 537 L581 533 L575 527 L574 527 L569 523 L561 519 L559 519 L552 515 L550 515 L549 514 L547 514 L543 512 L536 511 L532 509 L523 508 L522 507 L514 507 L513 506 L502 506 L501 505 L487 505 L486 506 L480 506 L479 507 Z M729 494 L727 493 L715 492 L714 491 L702 491 L701 490 L681 490 L680 491 L668 491 L667 492 L663 492 L662 493 L657 493 L656 494 L649 495 L645 497 L642 497 L639 499 L637 499 L634 501 L632 501 L628 503 L626 505 L620 508 L615 513 L614 513 L613 515 L613 519 L623 512 L629 509 L631 509 L640 504 L642 504 L643 503 L645 503 L646 502 L648 502 L652 500 L656 500 L660 498 L663 498 L664 497 L674 496 L675 495 L681 495 L682 494 L696 494 L697 493 L715 493 L716 494 Z M473 488 L491 488 L492 489 L508 490 L509 491 L513 491 L514 492 L519 492 L520 493 L527 494 L531 496 L534 496 L535 497 L537 497 L538 498 L546 500 L558 506 L560 506 L568 510 L570 512 L576 515 L581 519 L581 517 L582 516 L581 513 L580 513 L576 509 L575 509 L570 505 L565 503 L563 501 L561 501 L559 499 L557 499 L549 495 L547 495 L543 493 L540 493 L536 491 L532 491 L528 489 L523 489 L522 488 L516 488 L515 487 L504 487 L503 486 L484 486 L483 487 L475 487 Z M726 475 L720 474 L719 473 L705 472 L704 471 L673 471 L672 472 L659 473 L658 474 L655 474 L654 475 L650 475 L646 477 L643 477 L633 482 L631 482 L627 485 L625 485 L619 490 L618 490 L613 495 L613 500 L624 492 L636 486 L638 486 L646 482 L649 482 L650 481 L656 480 L657 479 L660 479 L661 478 L665 478 L666 477 L670 477 L671 476 L677 476 L678 475 L685 475 L686 474 L720 474 L721 475 Z M473 468 L485 468 L486 469 L496 469 L497 470 L505 470 L506 471 L511 471 L512 472 L516 472 L517 473 L525 474 L529 476 L536 477 L539 479 L541 479 L542 480 L550 482 L557 486 L559 486 L561 488 L563 488 L565 490 L575 495 L580 499 L582 498 L581 494 L578 491 L577 491 L569 485 L555 478 L553 478 L550 476 L548 476 L547 475 L545 475 L541 473 L538 473 L534 471 L530 471 L529 470 L525 470 L524 469 L519 469 L518 468 L512 468 L511 467 L476 467 L475 468 Z"
    />
  </svg>
)

// Кнопка зависит от роли:
// seller/admin → Кабинет + Добавить книгу
// user → Добавить книгу (с подсказкой что станет продавцом)
function HeaderActions({ isSeller, isAdmin }: { isSeller: boolean; isAdmin: boolean }) {
  const hasDashboard = isSeller || isAdmin

  return (
    <div className="flex items-center gap-2">
      {hasDashboard && (
        <Link
          href="/dashboard"
          className={cn(
            'inline-flex items-center gap-1.5 h-9 px-3 rounded-lg',
            'text-sm font-medium text-ash border border-surface2',
            'hover:text-ink hover:bg-surface hover:border-surface3',
            'transition-all duration-150',
          )}
        >
          <LayoutDashboard size={14} strokeWidth={1.8} />
          Кабинет
        </Link>
      )}
      <Link
        href="/add-book"
        className={cn(
          'hidden lg:flex items-center gap-1.5 h-9 px-4 rounded-lg',
          'text-sm font-medium',
          'bg-accent text-bg border border-accent',
          'hover:bg-accent2 hover:border-accent2',
          'transition-all duration-150',
        )}
      >
        <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
        Добавить книгу
      </Link>
    </div>
  )
}

export const Header = memo(() => {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useCurrentUser()
  const { isSeller, isAdmin } = useCurrentRole()
  const userName = useCurrentUserName(user)
  const userImage = useCurrentUserImage(user)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Close on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-surface2/70 bg-bg/90 backdrop-blur-sm">
        <Container>
          <div className="flex h-16 items-center justify-between gap-3">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-sm shrink-0"
              aria-label="CaucasusLibrary — на главную"
            >
              <CaucasusLogo />
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden md:flex justify-center items-center gap-1 flex-1"
              aria-label="Основная навигация"
            >
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm transition-all duration-150',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    pathname === href || pathname?.startsWith(href + '/')
                      ? 'text-accent bg-accent/10 font-medium'
                      : 'text-ash hover:text-ink hover:bg-surface',
                  )}
                  aria-current={pathname === href ? 'page' : undefined}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right */}
            <div className="hidden md:flex items-center gap-3">
              {user && <HeaderActions isSeller={isSeller} isAdmin={isAdmin} />}
              <UserAvatar />
            </div>

            {/* Mobile burger */}
            <button
              className={cn(
                'md:hidden flex flex-col justify-center gap-1.25 w-10 h-10 rounded-lg',
                'text-ash hover:text-ink hover:bg-surface',
                'transition-colors duration-150 cursor-pointer items-center',
              )}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            >
              <span
                className={cn(
                  'block w-5 h-px bg-current transition-all duration-200',
                  menuOpen && 'translate-y-1.5 rotate-45',
                )}
              />
              <span
                className={cn(
                  'block w-5 h-px bg-current transition-all duration-200',
                  menuOpen && 'opacity-0',
                )}
              />
              <span
                className={cn(
                  'block w-5 h-px bg-current transition-all duration-200',
                  menuOpen && '-translate-y-1.5 -rotate-45',
                )}
              />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 md:hidden flex flex-col bg-bg"
          role="dialog"
          aria-modal="true"
          aria-label="Мобильная навигация"
        >
          <div className="h-16 shrink-0 border-b border-surface2/70" />

          <div className="flex-1 overflow-y-auto flex flex-col">
            <Container className="flex-1 flex flex-col">
              {/* Main nav */}
              <nav aria-label="Основная навигация">
                <ul className="flex flex-col pt-4">
                  {NAV_LINKS.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className={cn(
                          'flex items-center justify-between py-3.5 border-b border-surface2 transition-colors',
                          pathname === href
                            ? 'text-accent'
                            : 'text-ink hover:text-accent',
                        )}
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.25rem',
                          fontWeight: 400,
                          lineHeight: 1.1,
                        }}
                        onClick={() => setMenuOpen(false)}
                        aria-current={pathname === href ? 'page' : undefined}
                      >
                        {label}
                        {pathname === href && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Secondary links */}
              <div className="flex flex-col md:pt-2">
                {user && (isSeller || isAdmin) && (
                  <Link
                    href="/dashboard"
                    className={cn(
                      'flex items-center justify-between py-3.5 border-b border-surface2 transition-colors',
                      pathname === '/dashboard'
                        ? 'text-accent'
                        : 'text-ink hover:text-accent',
                    )}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      fontWeight: 400,
                      lineHeight: 1.1,
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Кабинет
                    {pathname === '/dashboard' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    )}
                  </Link>
                )}
                <Link
                  href="/favorites"
                  className={cn(
                    'flex items-center justify-between py-3.5 border-b border-surface2 transition-colors',
                    pathname === '/favorites'
                      ? 'text-accent'
                      : 'text-ink hover:text-accent',
                  )}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 400,
                    lineHeight: 1.1,
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  Избранное
                  {pathname === '/favorites' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  )}
                </Link>
                {user && (
                  <button
                    type="button"
                    className="flex items-center justify-between w-full py-3.5 border-b border-surface2 text-rose-700 hover:text-rose-800 transition-colors cursor-pointer"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      fontWeight: 400,
                      lineHeight: 1.1,
                    }}
                    onClick={async () => {
                      const { createClient } =
                        await import('@/shared/lib/supabase/client')
                      const supabase = createClient()
                      await supabase.auth.signOut()
                      setMenuOpen(false)
                    }}
                  >
                    Выйти
                    <LogOut size={16} strokeWidth={1.6} />
                  </button>
                )}
              </div>

              {/* Bottom: user / login */}
              <div className="mt-auto pt-4 pb-6 border-t border-surface2">
                {user ? (
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    onClick={() => setMenuOpen(false)}
                  >
                    <ProfileAvatar avatarUrl={userImage} name={userName} size="sm" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-ink leading-none truncate">
                        {userName ?? 'Профиль'}
                      </span>
                      <span className="text-xs text-ash truncate mt-0.5">
                        {user.email}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center justify-center h-10 w-full rounded-xl text-sm font-medium text-ash border border-surface2 hover:text-ink hover:bg-surface transition-all"
                    onClick={() => setMenuOpen(false)}
                  >
                    Войти
                  </Link>
                )}
              </div>
            </Container>
          </div>
        </div>
      )}
    </>
  )
})

Header.displayName = 'Header'

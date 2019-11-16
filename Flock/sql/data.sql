INSERT INTO users(username, fullname, email, password, phone, picture)
VALUES ('michjc', 'Michael Cafarella', 'michjc@umich.edu', 'sha512$a45ffdcc71884853a2cba9e6bc55e812$c739cef1aec45c6e345c8463136dc1ae2fe19963106cf748baf87c7102937aa96928aa1db7fe1d8da6bd343428ff3167f4500c8a61095fb771957b4367868fb8', 2483124234, NULL),
('jag', 'H.V. Jagadish', 'jag@umich.edu', 'sha512$a45ffdcc71884853a2cba9e6bc55e812$c739cef1aec45c6e345c8463136dc1ae2fe19963106cf748baf87c7102937aa96928aa1db7fe1d8da6bd343428ff3167f4500c8a61095fb771957b4367868fb8', 2483124234, NULL),
('deorio', 'Andrew DeOrio', 'jag@umich.edu', 'sha512$a45ffdcc71884853a2cba9e6bc55e812$c739cef1aec45c6e345c8463136dc1ae2fe19963106cf748baf87c7102937aa96928aa1db7fe1d8da6bd343428ff3167f4500c8a61095fb771957b4367868fb8', 2483124234, NULL);

INSERT INTO usersInfo(username, outdoor_adventures, cooking, gaming, night_life, swimming, weight_lifting, photography, yoga, basketball, dancing)
VALUES ('michjc', 0, 0, 0, 0, 0, 0, 1, 1, 0, 1),
('jag', 0, 0, 1, 0, 0, 1, 1, 0, 0, 1),
('deorio', 0, 0, 0, 0, 1, 0, 1, 0, 0, 0);

INSERT INTO events(eventID, eventName, host, phone, picture)
VALUES (1, 'Hiking with Friends', 'deorio', 2483124234, NULL),
(2, 'Yoga with Friends', 'jag', 2483124234, NULL),
(3, 'Jogging with Jag', 'jag', 2483124234, NULL);

INSERT INTO eventAttendees(eventID, username)
VALUES (1, 'michjc'),
(1, 'jag'),
(2, 'deorio');

INSERT INTO userSeenEvent(username, eventID)
VALUES('michjc', 1),
('jag', 1),
('deorio', 2),
('deorio', 1),
('jag', 2),
('jag', 3);

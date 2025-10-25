document.addEventListener('DOMContentLoaded', async () => {
    const firebaseConfig = {
        apiKey: "AIzaSyBQa0qbVaqTvpFGAJjFj2BTRm1c29z48fw",
        authDomain: "k-i-b-o-24cbe.firebaseapp.com",
        projectId: "k-i-b-o-24cbe",
        storageBucket: "k-i-b-o-24cbe.firebasestorage.app",
        messagingSenderId: "983754137013",
        appId: "1:983754137013:web:31731ce76eb8c036d7cdfc",
        measurementId: "G-0YHHMQ08BF"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const storage = firebase.storage();
    const auth = firebase.auth();

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            console.log("Usuario autenticado:", user.uid);
            const userDocRef = db.collection('users').doc(user.uid);
            const userDoc = await userDocRef.get();

            if (userDoc.exists) {
                const userData = userDoc.data();
                updateUserProfileUI(userData);
                populateSettingsPage(userData);
            } else {
                console.warn("No se encontró documento en Firestore para el usuario.");
                const fallbackData = {
                    name: user.displayName || "Usuario Anónimo",
                    email: user.email || "",
                    role: 'user',
                    avatarUrl: user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user.displayName || 'A'}`
                };
                updateUserProfileUI(fallbackData);
                populateSettingsPage(fallbackData);
            }
            initializeAppLogic();
        } else {
            console.log("No hay usuario. Redirigiendo a /login...");
            window.location.replace('/login');
        }
    });

    function updateUserProfileUI(userData) {
        const userAvatarElement = document.querySelector('.header .avatar-img');
        if (userAvatarElement) userAvatarElement.src = userData.avatarUrl;

        const userNameElement = document.querySelector('.header .user-name');
        if (userNameElement) userNameElement.textContent = userData.name;

        const userRoleElement = document.querySelector('.header .user-role');
        if (userRoleElement) userRoleElement.textContent = userData.role === 'teacher' ? 'Profesor' : 'Estudiante';

        const welcomeMessageElement = document.querySelector('.welcome-header h2');
        if (welcomeMessageElement) welcomeMessageElement.textContent = `¡Bienvenido de nuevo, ${userData.name.split(' ')[0]}!`;
    }

    function populateSettingsPage(userData) {
        const settingsAvatar = document.getElementById('settings-avatar');
        const settingsNameInput = document.getElementById('settings-name-input');
        const settingsEmailInput = document.getElementById('settings-email-input');

        if (settingsAvatar) settingsAvatar.src = userData.avatarUrl;
        if (settingsNameInput) settingsNameInput.value = userData.name;
        if (settingsEmailInput) settingsEmailInput.value = userData.email;
    }

    async function initializeAppLogic() {
        const navItems = document.querySelectorAll('.nav-card');
        const contentSections = document.querySelectorAll('.content-section');
        const indicator = document.querySelector('.active-indicator');
        const navContainer = document.querySelector('.nav-container');
        const sidebarRight = document.querySelector('.sidebar-right');
        const toggleBtn = document.getElementById('toggle-sidebar-btn');
        const panel = document.querySelector('.panel');
        const chatListContainer = document.querySelector('.chat-list');
        const chatCounter = document.querySelector('.nav-card.chats .nav-card__pill');
        const addChatBtn = document.getElementById('add-chat-btn');
        const chatMessages = document.getElementById("chat-messages");
        const sendBtn = document.getElementById("send-btn");
        const messageInput = document.getElementById("message-input");
        const attachFileBtn = document.getElementById("attach-file-btn");
        const sendAudioBtn = document.getElementById("send-audio-btn");
        const trophyDisplay = document.getElementById("trophy-display");
        const nextGoalCard = document.getElementById("next-goal");
        const modalOverlay = document.getElementById('add-chat-modal-overlay');
        const newChatNameInput = document.getElementById('new-chat-name-input');
        const confirmChatBtn = document.getElementById('confirm-chat-btn');
        const cancelChatBtn = document.getElementById('cancel-chat-btn');
        const nextMissionCardBody = document.getElementById('next-mission-card-body');
        const tipOfTheDayBody = document.getElementById('tip-of-the-day-body');
        const dateTimeCardDate = document.getElementById('datetime-card-date');
        const dateTimeCardTime = document.getElementById('datetime-card-time');
        const logoutBtn = document.getElementById('logout-btn');
        const avatarInput = document.getElementById('avatar-upload-input');
        const settingsAvatar = document.getElementById('settings-avatar');



        let mediaRecorder;
        let audioChunks = [];
        let isRecording = false;
        let selectedAvatarFile = null;

        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = e => {
                        settingsAvatar.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                auth.signOut().catch(error => console.error("Error al cerrar sesión:", error));
            });
        }

        const saveProfileBtn = document.getElementById('save-profile-btn');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', async () => {
                const user = auth.currentUser;
                if (!user) {
                    alert("No se encontró usuario autenticado.");
                    return;
                }

                const nameInput = document.getElementById('settings-name-input');
                const emailInput = document.getElementById('settings-email-input');
                const avatarInput = document.getElementById('avatar-upload-input');
                const avatarPreview = document.getElementById('settings-avatar');

                if (!nameInput || !emailInput || !avatarInput || !avatarPreview) {
                    console.warn("Elementos de configuración no encontrados en el DOM.");
                    return;
                }

                const newName = nameInput.value.trim();
                const newEmail = emailInput.value.trim();
                const avatarFile = avatarInput.files[0];

                let avatarUrl = user.photoURL;

                try {
                    if (avatarFile) {
                        const storageRef = firebase.storage().ref(`avatars/${user.uid}/${Date.now()}_${avatarFile.name}`);
                        const snapshot = await storageRef.put(avatarFile);
                        avatarUrl = await snapshot.ref.getDownloadURL();
                    }

                    await user.updateProfile({ displayName: newName, photoURL: avatarUrl });

                    await db.collection('users').doc(user.uid).update({
                        name: newName,
                        email: newEmail,
                        avatarUrl: avatarUrl
                    });

                    avatarPreview.src = avatarUrl;

                    alert("Perfil actualizado correctamente.");
                    updateUserProfileUI({ name: newName, email: newEmail, avatarUrl: avatarUrl });
                } catch (error) {
                    console.error("Error al actualizar el perfil:", error);
                    alert("No se pudo actualizar el perfil. Inténtalo de nuevo.");
                }
            });
        }

        const changePasswordBtn = document.getElementById('change-password-btn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', async () => {
                const user = auth.currentUser;
                if (!user) {
                    alert("No se encontró usuario autenticado.");
                    return;
                }

                const newPassword = prompt("Introduce tu nueva contraseña:");
                if (!newPassword) return;

                try {
                    await user.updatePassword(newPassword);
                    alert("Contraseña actualizada correctamente.");
                } catch (error) {
                    console.error("Error al actualizar la contraseña:", error);
                    if (error.code === 'auth/requires-recent-login') {
                        alert("Debes volver a iniciar sesión para cambiar tu contraseña.");
                    } else {
                        alert("No se pudo actualizar la contraseña. Inténtalo de nuevo.");
                    }
                }
            });
        }

        const deleteAccountBtn = document.getElementById('delete-account-btn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', async () => {
                const confirmar = confirm("Esta acción eliminará tu cuenta permanentemente. ¿Continuar?");
                if (!confirmar) return;

                const user = auth.currentUser;
                if (!user) {
                    alert("No se encontró usuario autenticado.");
                    return;
                }

                try {
                    await db.collection('users').doc(user.uid).delete();
                    await user.delete();
                    alert("Tu cuenta ha sido eliminada.");
                    window.location.replace('login.html');
                } catch (error) {
                    console.error("Error al eliminar la cuenta:", error);
                    if (error.code === 'auth/requires-recent-login') {
                        alert("Debes volver a iniciar sesión para eliminar tu cuenta.");
                    } else {
                        alert("No se pudo eliminar la cuenta. Inténtalo de nuevo.");
                    }
                }

            });
        }

        let currentChatId = null;
        let unsubscribeChatHistory = null;
        let unsubscribeMessages = null;

        function renderChatHistory() {
            if (unsubscribeChatHistory) unsubscribeChatHistory();
            unsubscribeChatHistory = db.collection('chats').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
                if (!chatListContainer) return;
                chatListContainer.innerHTML = '';
                const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                updateDashboard(chats);
                if (chatCounter) chatCounter.textContent = chats.length;
                chats.forEach(chat => {
                    const chatItem = document.createElement('div');
                    chatItem.className = 'chat-item';
                    chatItem.setAttribute('data-chat-id', chat.id);
                    const avatar = chat.avatar || "static/images/Agente.webp";
                    chatItem.innerHTML = `<div class="chat-avatar-container"><div class="chat-avatar-bg"></div><img class="chat-avatar" src="${avatar}" alt="Avatar" /><div class="chat-status-green"></div></div><div class="chat-name">${chat.name}</div><div class="chat-item__icon green"><i class="fa-solid fa-comment-dots"></i></div>`;
                    chatListContainer.appendChild(chatItem);
                    chatItem.addEventListener('click', () => {
                        if (currentChatId === chat.id) return;
                        currentChatId = chat.id;
                        if (chatMessages) chatMessages.innerHTML = '';
                        loadChatMessages(currentChatId);
                        updateTrophyPanel(chat);
                        document.querySelectorAll('.chat-item').forEach(item => item.style.backgroundColor = 'transparent');
                        chatItem.style.backgroundColor = 'rgba(0, 119, 255, 0.2)';
                    });
                });
                if (!currentChatId && chats.length > 0) {
                    document.querySelector('.chat-item')?.click();
                } else if (chats.length === 0) {
                    updateTrophyPanel(null);
                }
            });
        }

        function loadChatMessages(chatId) {
            if (!chatMessages) return;
            if (unsubscribeMessages) unsubscribeMessages();
            chatMessages.innerHTML = 'Cargando mensajes...';
            let isInitialLoad = true;
            unsubscribeMessages = db.collection('chats').doc(chatId).collection('messages').orderBy('timestamp', 'asc')
                .onSnapshot(snapshot => {
                    if (isInitialLoad) {
                        chatMessages.innerHTML = '';
                    }
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            const msgData = { id: change.doc.id, ...change.doc.data() };
                            const shouldAnimate = !isInitialLoad && msgData.type === 'bot';
                            renderMessage(msgData, shouldAnimate);
                        }
                    });
                    isInitialLoad = false;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, error => {
                    console.error("Error al cargar mensajes: ", error);
                    chatMessages.innerHTML = 'Error al cargar los mensajes.';
                });
        }

        async function sendMessage() {
            const texto = messageInput.value.trim();
            if (texto === "" || !currentChatId) return;

            const pictogramas = await buscarPictogramas(texto);

            const messageData = {
                type: 'user',
                text: texto,
                pictogramas,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                contentType: 'text'
            };

            const chatRef = db.collection('chats').doc(currentChatId);

            chatRef.collection('messages').add(messageData)
                .then(() => {
                    messageInput.value = "";
                    return chatRef.update({ userMessageCount: firebase.firestore.FieldValue.increment(1) });
                })
                .then(() => {
                    checkAndUnlockTrophies(currentChatId);
                    llamarApiDelBot(texto, currentChatId);
                })
                .catch(error => console.error("Error al enviar mensaje: ", error));
        }

        async function llamarApiDelBot(userText, chatId) {
            console.log("Llamando a la API del Bot en Flask...");
            try {
                const response = await fetch('/api/get_bot_response', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: userText,
                        chatId: chatId
                    })
                });

                if (!response.ok) {
                    console.error("Error al llamar a la API del bot:", response.statusText);
                }
            } catch (error) {
                console.error("Error de red al llamar a la API del bot:", error);
            }
        }


        async function handleFileUpload(file) {
            if (!file || !currentChatId) {
                alert("Por favor, selecciona un chat primero.");
                return;
            }
            console.log("Subiendo archivo:", file.name);

            try {
                const storageRef = storage.ref(`chats/${currentChatId}/${Date.now()}_${file.name}`);

                const snapshot = await storageRef.put(file);

                const downloadURL = await snapshot.ref.getDownloadURL();

                let contentType = 'file';
                if (file.type.startsWith('image/')) {
                    contentType = 'image';
                } else if (file.type.startsWith('audio/')) {
                    contentType = 'audio';
                }

                const messageData = {
                    type: 'user',
                    text: '',
                    pictogramas: [],
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    contentType: contentType,
                    fileUrl: downloadURL,
                    fileName: file.name
                };

                await db.collection('chats').doc(currentChatId).collection('messages').add(messageData);


            } catch (error) {
                console.error("Error al subir archivo:", error);
                alert("No se pudo subir el archivo. Inténtalo de nuevo.");
            }
        }

        function renderRatingStarsHTML(rating) {
            let html = '';
            for (let i = 1; i <= 5; i++) {
                const className = i <= rating ? 'rated' : '';
                html += `<i class="rating-star ${className} fa-solid fa-star" data-value="${i}"></i>`;
            }
            return html;
        }

        function initializeRating(ratingStarsElement, messageId) {
            const stars = ratingStarsElement.querySelectorAll('.rating-star');
            const chatId = currentChatId;
            let currentRating = parseInt(ratingStarsElement.dataset.currentRating);

            const updateStars = (rating) => {
                stars.forEach(star => {
                    const starValue = parseInt(star.dataset.value);
                    star.classList.remove('rated', 'temp-hover');
                    if (starValue <= rating) {
                        star.classList.add('rated');
                    }
                });
            };

            updateStars(currentRating);

            ratingStarsElement.addEventListener('mouseover', (e) => {
                if (e.target.classList.contains('rating-star')) {
                    const hoverValue = parseInt(e.target.dataset.value);
                    stars.forEach(star => {
                        const starValue = parseInt(star.dataset.value);
                        star.classList.remove('temp-hover');
                        if (starValue <= hoverValue) {
                            star.classList.add('temp-hover');
                        }
                    });
                    updateStars(hoverValue);
                }
            });

            ratingStarsElement.addEventListener('mouseout', () => {
                stars.forEach(star => star.classList.remove('temp-hover'));
                updateStars(currentRating);
            });

            ratingStarsElement.addEventListener('click', async (e) => {
                if (e.target.classList.contains('rating-star')) {
                    const newRating = parseInt(e.target.dataset.value);

                    currentRating = newRating;
                    ratingStarsElement.dataset.currentRating = newRating;
                    updateStars(newRating);

                    try {
                        const messageRef = db.collection('chats').doc(chatId).collection('messages').doc(messageId);
                        await messageRef.update({ rating: newRating });

                        const label = ratingStarsElement.previousElementSibling;
                        if (label) {
                            label.textContent = `¡Gracias por tu valoración (${newRating}/5)!`;
                            setTimeout(() => { label.textContent = '¿Te ha servido?'; }, 3000);
                        }

                        console.log(`Valoración de ${newRating} estrellas guardada para el mensaje ${messageId}`);
                    } catch (error) {
                        console.error("Error al guardar la valoración:", error);
                        alert("Hubo un error al guardar tu valoración.");
                    }
                }
            });
        }


        function renderMessage(msg, animate = false) {
            if (!chatMessages) return;
            const chatMessageElement = document.createElement("div");
            chatMessageElement.classList.add("chat-bubble", msg.type === 'user' ? "user-message" : "bot-message");
            if (msg.id) chatMessageElement.setAttribute('data-message-id', msg.id);

            let contentHTML = '', pictogramasHTML = '';
            if (msg.pictogramas && msg.pictogramas.length > 0) {
                pictogramasHTML = `<div class="pictogram-container">${msg.pictogramas.map(url => `<img src="${url}" class="pictogram-image">`).join('')}</div>`;
            }

            if (msg.contentType === 'audio' && msg.fileUrl) {
                contentHTML = `<audio controls src="${msg.fileUrl}"></audio>`;
            } else if (msg.contentType === 'image' && msg.fileUrl) {
                contentHTML = `<img src="${msg.fileUrl}" alt="${msg.fileName || 'Imagen'}" class="attached-image">`;
            } else if (msg.contentType === 'file' && msg.fileUrl) {
                contentHTML = `<a href="${msg.fileUrl}" target="_blank" class="file-attachment"><i class="fa-solid fa-file-arrow-down"></i> ${msg.fileName || 'Descargar archivo'}</a>`;
            } else {
                contentHTML = (msg.type === 'user') ? `<p>${msg.text || ''}</p>` : `<p class="bot-text-container"></p>`;
            }

            const messageDate = msg.timestamp?.toDate ? msg.timestamp.toDate() : new Date();
            const formattedTime = messageDate.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' });
            const userAvatarUrl = document.querySelector('.header .avatar-img').src;
            const userAvatar = `<img src="${userAvatarUrl}" alt="User" class="message-avatar">`;
            const botAvatar = `<img src="static/images/Agente.webp" alt="Bot" class="message-avatar">`;

            let feedbackHTML = '';
            if (msg.type === 'bot') {
                const rating = msg.rating || 0;
                feedbackHTML = `<div class="bot-feedback-container"><span class="rating-label">¿Te ha servido?</span><div class="rating-stars" data-message-id="${msg.id}" data-current-rating="${rating}">${renderRatingStarsHTML(rating)}</div></div>`;
            }

            const messageContentBubble = `<div class="message-content">${pictogramasHTML}${contentHTML}${feedbackHTML}</div>`;
            const metaHTML = `<div class="message-meta"><span>${formattedTime}</span></div>`;

            chatMessageElement.innerHTML = `${msg.type === 'bot' ? botAvatar : ''}<div class="message-and-meta">${messageContentBubble}${metaHTML}</div>${msg.type === 'user' ? userAvatar : ''}`;
            chatMessages.appendChild(chatMessageElement);

            if (msg.type === 'bot' && msg.text) {
                const textContainer = chatMessageElement.querySelector('.bot-text-container');
                if (textContainer) {
                    if (animate) {
                        typewriterEffect(textContainer, msg.text);
                    } else {
                        textContainer.textContent = msg.text;
                    }
                }

                const ratingStarsElement = chatMessageElement.querySelector('.rating-stars');
                if (ratingStarsElement && msg.id) {
                    initializeRating(ratingStarsElement, msg.id);
                }
            }

            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        async function handleAudioRecording() {
            if (!isRecording) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                    audioChunks = [];
                    mediaRecorder.ondataavailable = event => audioChunks.push(event.data);

                    mediaRecorder.onstop = async () => {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                        const fileName = `grabacion_${Date.now()}.webm`;

                        audioChunks = [];
                        stream.getTracks().forEach(track => track.stop());

                        if (!currentChatId) {
                            alert("Por favor, selecciona un chat primero.");
                            return;
                        }

                        try {
                            const storageRef = storage.ref(`chats/${currentChatId}/${fileName}`);
                            const snapshot = await storageRef.put(audioBlob);
                            const downloadURL = await snapshot.ref.getDownloadURL();

                            const messageData = {
                                type: 'user',
                                text: '',
                                pictogramas: [],
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                contentType: 'audio',
                                fileUrl: downloadURL,
                                fileName: 'Grabación de voz'
                            };

                            await db.collection('chats').doc(currentChatId).collection('messages').add(messageData);

                        } catch (error) {
                            console.error("Error al subir audio:", error);
                            alert("No se pudo subir el audio.");
                        }
                    };

                    mediaRecorder.start();
                    isRecording = true;
                    sendAudioBtn.style.color = '#FF5E61';
                    console.log("Grabación iniciada...");
                } catch (error) {
                    console.error("Error al acceder al micrófono:", error);
                    alert("No se pudo acceder al micrófono. Asegúrate de dar permiso.");
                }
            } else {
                mediaRecorder.stop();
                isRecording = false;
                sendAudioBtn.style.color = '';
                console.log("Grabación detenida.");
            }
        }

        if (addChatBtn) { addChatBtn.addEventListener('click', (e) => { e.stopPropagation(); modalOverlay.classList.remove('hidden'); newChatNameInput.focus(); }); }
        if (cancelChatBtn) { cancelChatBtn.addEventListener('click', () => modalOverlay.classList.add('hidden')); }
        if (modalOverlay) { modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) modalOverlay.classList.add('hidden'); }); }
        if (confirmChatBtn) { confirmChatBtn.addEventListener('click', () => { const newChatName = newChatNameInput.value.trim(); if (newChatName) { db.collection('chats').add({ name: newChatName, avatar: 'static/images/Agente.webp', createdAt: firebase.firestore.FieldValue.serverTimestamp(), userMessageCount: 0, unlockedTrophies: [] }).then(() => { handleNavClick(document.getElementById('chats-link')); modalOverlay.classList.add('hidden'); newChatNameInput.value = ''; }).catch(error => console.error("Error al crear nuevo chat: ", error)); } else { alert("Por favor, ingresa un nombre para el chat."); } }); }
        const homeNewChatBtn = document.getElementById('home-new-chat-btn');
        const homeGoToDbBtn = document.getElementById('home-go-to-db-btn');
        if (homeNewChatBtn) { homeNewChatBtn.addEventListener('click', () => { modalOverlay.classList.remove('hidden'); newChatNameInput.focus(); }); }
        if (homeGoToDbBtn) { homeGoToDbBtn.addEventListener('click', () => document.querySelector('.nav-card.base-datos')?.click()); }

        function updateDashboard(chats) { const statsTotalChats = document.getElementById('stats-total-chats'); const statsUnlockedTrophies = document.getElementById('stats-unlocked-trophies'); const recentChatsContainer = document.getElementById('recent-chats-container'); if (!statsTotalChats || !statsUnlockedTrophies || !recentChatsContainer) return; let totalTrophies = 0; chats.forEach(chat => { totalTrophies += (chat.unlockedTrophies || []).length; }); statsTotalChats.textContent = chats.length; statsUnlockedTrophies.textContent = totalTrophies; recentChatsContainer.innerHTML = ''; if (chats.length === 0) { recentChatsContainer.innerHTML = '<p class="empty-state">Aún no hay chats.</p>'; return; } const recentChats = chats.slice(0, 3); recentChats.forEach(chat => { const chatElement = document.createElement('div'); chatElement.className = 'recent-chat-item'; chatElement.innerHTML = `<img src="${chat.avatar || 'static/images/Agente.webp'}" alt="Avatar"><span class="chat-name">${chat.name}</span><span class="go-to-chat">Abrir chat <i class="fa-solid fa-arrow-right"></i></span>`; chatElement.addEventListener('click', () => { const chatLinkInSidebar = document.querySelector(`.chat-item[data-chat-id="${chat.id}"]`); if (chatLinkInSidebar) { document.getElementById('chats-link')?.click(); setTimeout(() => chatLinkInSidebar.click(), 50); } }); recentChatsContainer.appendChild(chatElement); }); }
        const tips = ["Puedes expandir y contraer el panel lateral haciendo clic en la flecha verde.", "Cada 5 mensajes que envías en un chat, desbloqueas un nuevo logro. ¡Inténtalo!", "La sección 'Base de Datos' muestra una hoja de cálculo de Google en tiempo real.", "K-I-B-O puede buscar pictogramas de ARASAAC para ilustrar tus conversaciones."];
        function displayRandomTip() { if (tipOfTheDayBody) { tipOfTheDayBody.innerHTML = `<p>${tips[Math.floor(Math.random() * tips.length)]}</p>`; } }
        function updateClock() { if (dateTimeCardDate && dateTimeCardTime) { const now = new Date(); dateTimeCardDate.textContent = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); dateTimeCardTime.textContent = now.toLocaleTimeString('es-ES'); } }
        const TROPHY_GOALS = { 5: { id: 't1', emoji: '👍' }, 10: { id: 't2', emoji: '🧠' }, 15: { id: 't3', emoji: '🔍' }, 20: { id: 't4', emoji: '🚀' }, 25: { id: 't5', emoji: '🌟' }, 30: { id: 't6', emoji: '🦾' }, 35: { id: 't7', emoji: '🎓' }, 40: { id: 't8', emoji: '🌈' }, 45: { id: 't9', emoji: '🏆' } };
        async function checkAndUnlockTrophies(chatId) { const chatRef = db.collection('chats').doc(chatId); const doc = await chatRef.get(); if (!doc.exists) return; const chatData = doc.data(); const currentCount = chatData.userMessageCount || 0; const currentTrophies = chatData.unlockedTrophies || []; const newTrophiesToUnlock = []; Object.keys(TROPHY_GOALS).forEach(countStr => { const count = parseInt(countStr); const goal = TROPHY_GOALS[count]; if (currentCount >= count && !currentTrophies.includes(goal.id)) { newTrophiesToUnlock.push(goal.id); } }); if (newTrophiesToUnlock.length > 0) { await chatRef.update({ unlockedTrophies: firebase.firestore.FieldValue.arrayUnion(...newTrophiesToUnlock) }); } updateTrophyPanel({ ...chatData, id: chatId, userMessageCount: currentCount, unlockedTrophies: [...currentTrophies, ...newTrophiesToUnlock] }); }
        function updateTrophyPanel(chat) { if (!trophyDisplay) return; if (!chat) { trophyDisplay.querySelectorAll(".achievement-slot").forEach(slot => { slot.textContent = '❓'; slot.classList.remove('unlocked'); }); if (nextGoalCard) nextGoalCard.innerHTML = `<h3>¡Selecciona un chat!</h3><p>Elige una conversación para ver tu progreso.</p>`; if (nextMissionCardBody) nextMissionCardBody.innerHTML = `<p>Elige una conversación para ver tu próxima misión.</p>`; return; } const messageCount = chat.userMessageCount || 0; const unlockedTrophies = chat.unlockedTrophies || []; const slots = trophyDisplay.querySelectorAll(".achievement-slot"); let nextGoalCount = Infinity, nextGoalInfo = null; Object.keys(TROPHY_GOALS).forEach((count, index) => { if (index >= slots.length) return; const goal = TROPHY_GOALS[count]; const slot = slots[index]; if (unlockedTrophies.includes(goal.id)) { slot.textContent = goal.emoji; slot.classList.add('unlocked'); } else { slot.textContent = '❓'; slot.classList.remove('unlocked'); } if (!unlockedTrophies.includes(goal.id) && parseInt(count) < nextGoalCount) { nextGoalCount = parseInt(count); nextGoalInfo = goal; } }); const updateCard = (card, info) => { if (!card) return; if (info) { const remaining = nextGoalCount - messageCount; card.innerHTML = card === nextGoalCard ? `<h3>¡Siguiente misión!</h3><p>Escribe ${remaining} mensajes más para ganar el trofeo ${info.emoji}</p>` : `<p>Te faltan solo <strong>${remaining} mensajes</strong> para desbloquear tu próximo logro: ${info.emoji}</p>`; } else { card.innerHTML = card === nextGoalCard ? `<h3>¡Misión completada!</h3><p>Has desbloqueado todos los logros 🎉</p>` : `<p>¡Buen trabajo! Has completado todas las misiones por ahora 🎉</p>`; } }; updateCard(nextGoalCard, nextGoalInfo); updateCard(nextMissionCardBody, nextGoalInfo); }
        if (toggleBtn && panel) { toggleBtn.addEventListener('click', () => { panel.classList.toggle('expanded'); const icon = toggleBtn.querySelector('i'); icon.className = panel.classList.contains('expanded') ? 'fa-solid fa-arrow-left' : 'fa-solid fa-arrow-right'; }); }
        const googleSheetIframe = `<iframe src="https://docs.google.com/spreadsheets/d/1hwiHpKXNqfelqAbD1VjXloBOBdWYV6Kk/edit?usp=sharing&ouid=114527888935603933122&rtpof=true&sd=true"></iframe>`;
        function handleNavClick(item) { if (!item || item.id === 'logout-btn') return; if (!panel.classList.contains('expanded')) { panel.classList.add('expanded'); toggleBtn.querySelector('i').className = 'fa-solid fa-arrow-left'; } navItems.forEach(nav => nav.classList.remove('active-nav')); item.classList.add('active-nav'); indicator.style.top = `${navContainer.offsetTop + item.offsetTop}px`; indicator.style.height = `${item.offsetHeight}px`; const targetId = item.dataset.target; contentSections.forEach(section => section.classList.remove('active')); document.getElementById(targetId)?.classList.add('active'); sidebarRight.style.display = targetId === 'chats' ? 'flex' : 'none'; if (targetId === 'database') { const dbSection = document.getElementById('database'); if (dbSection && !dbSection.querySelector('iframe')) { dbSection.innerHTML = `${googleSheetIframe}`; } } }
        navItems.forEach(item => item.addEventListener('click', () => handleNavClick(item)));
        const defaultActiveItem = document.querySelector('.nav-card.inicio');
        if (defaultActiveItem) { setTimeout(() => { indicator.style.transition = 'none'; handleNavClick(defaultActiveItem); setTimeout(() => indicator.style.transition = 'top 0.4s cubic-bezier(0.23, 1, 0.32, 1), height 0.4s cubic-bezier(0.23, 1, 0.32, 1)', 50); }, 10); }

        async function buscarPictogramas(texto) {
            const palabras = texto.toLowerCase().replace(/[.,!?;¿¡]/g, '').split(' ');
            const pictogramasUnicos = new Map();
            for (const palabra of palabras) {
                if (palabra.length > 2) {
                    try {
                        const response = await fetch(`https://api.arasaac.org/v1/pictograms/es/search/${palabra}`);
                        if (response.ok) {
                            const resultados = await response.json();
                            if (resultados.length > 0 && !pictogramasUnicos.has(resultados[0]._id)) {
                                pictogramasUnicos.set(resultados[0]._id, `https://api.arasaac.org/v1/pictograms/${resultados[0]._id}`);
                            }
                        }
                    } catch (error) {
                        console.error("Error buscando pictograma:", error);
                    }
                }
            }
            return Array.from(pictogramasUnicos.values());
        }

        function typewriterEffect(element, text, speed = 40) { let i = 0; element.innerHTML = ''; const intervalId = setInterval(() => { if (i < text.length) { element.innerHTML += text.charAt(i++); if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight; } else { clearInterval(intervalId); } }, speed); }

        if (sendBtn) sendBtn.addEventListener("click", sendMessage);
        if (messageInput) messageInput.addEventListener("keypress", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
        if (attachFileBtn) attachFileBtn.addEventListener("click", () => { const fileInput = document.createElement('input'); fileInput.type = 'file'; fileInput.onchange = () => { if (fileInput.files[0]) handleFileUpload(fileInput.files[0]); }; fileInput.click(); });
        if (sendAudioBtn) sendAudioBtn.addEventListener("click", handleAudioRecording);

        displayRandomTip();
        updateClock();
        setInterval(updateClock, 1000);
        renderChatHistory();

    }
});
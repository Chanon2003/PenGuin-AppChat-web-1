const auth_routes = '/api/auth'
const contacts_routes = '/api/contacts'
const messages_routes = '/api/messages'
const channel_routes = '/api/channels'

const SummaryApi = {
  signup_route: {
    url: `${auth_routes}/signup`,
    method: 'post',
  },
  login_route: {
    url: `${auth_routes}/login`,
    method: 'post',
  },
  logout: {
    url: `${auth_routes}/logout`,
    method: 'get',
  },
  refreshToken: {
    url: `${auth_routes}/refresh-token`,
    method: 'post',
  },
  get_user_info: {
    url: `${auth_routes}/user-Info`,
    method: 'get',
  },
  update_profile_route: {
    url: `${auth_routes}/update-profile`,
    method: 'post',
  },
  add_profile_image: {
    url: `${auth_routes}/add-profile-image`,
    method: 'post',
  },
  remove_profile_image: {
    url: `${auth_routes}/remove-profile-image`,
    method: 'delete',
  },
  search_contacts_routes: {
    url: `${contacts_routes}/search`,
    method: 'post',
  },
  get_all_messages_routes: {
    url: `${messages_routes}/get-messages`,
    method: 'post',
  },
  get_all_contactsDM_routes: {
    url: `${contacts_routes}/get-contacts-for-dm`,
    method: 'get',
  },
  upload_file_routes: {
    url: `${messages_routes}/upload-file`,
    method: 'post',
  },
  get_all_contacts_routes: {
    url: `${contacts_routes}/get-all-contacts`,
    method: 'get',
  },
  create_channel_routes: {
    url: `${channel_routes}/create-channel`,
    method: 'post',
  },
  get_user_channel_routes: {
    url: `${channel_routes}/get-user-channels`,
    method: 'get',
  },
  get_channel_messages: {
    url: `${channel_routes}/get-channels-message`,
    method: 'get',
  },
  delete_message_route_solo:{
    url: `${messages_routes}/delete/messages`,
    method: 'delete',
  }
}

export default SummaryApi
<template>
  <v-app>

    <v-main>
      <v-container>
        <v-data-table
                :headers="headers"
                :items="dataSet"
                :loading ="loading"
                class="elevation-1"
        >
          <template v-slot:item.providers="{ item }">
            <div v-for="(provider, key) in item.providers" :key="key">
              <div>
                {{ provider.name }}
                <span v-if="item.providers.length !== key+1">,</span>
              </div>
            </div>
          </template>
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Clients</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="550px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" dark class="mb-2" v-bind="attrs" @click="showAddDialog">
                    New Client
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>

                        <v-col cols="12">
                          <v-text-field
                                  v-model="form.name"
                                  label="Name"
                                  outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                                  v-model="form.email"
                                  type="email"
                                  label="Email"
                                  outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                                  v-model="form.phone"
                                  label="Phone Number"
                                  outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="7" v-if="!isEditing">
                          <v-text-field
                                  v-model="providersForm.name"
                                  label="Providers"
                                  outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="5" v-if="!isEditing">
                          <v-btn color="primary" @click="addProvider" x-large>Add Provider</v-btn>
                        </v-col>
                        <v-col cols="12">
                          <v-list flat subheader three-line>

                            <v-list-item-group
                                    v-model="providersGroup"
                                    multiple
                                    active-class=""

                            >
                              <v-list-item v-for="(provider, key) in providers" :key="key">
                                <template v-slot:default="{ active }">
                                  <div class="d-flex" @click="toggleSelectedProviders(key, active, provider._id)">
                                    <v-list-item-action >
                                      <v-checkbox  :input-value="active">{{ provider._id }}</v-checkbox>
                                    </v-list-item-action>

                                    <v-list-item-content class="row">
                                      <div class="col-12 d-flex mx-4">
                                        <v-list-item-title>{{ provider.name }}</v-list-item-title>
                                        <v-icon @click="editProvider(provider)">mdi-pencil</v-icon>
                                        <v-icon color="error" @click="removeProvider(provider._id)">mdi-delete</v-icon>
                                      </div>

                                    </v-list-item-content>
                                  </div>

                                </template>
                              </v-list-item>

                            </v-list-item-group>
                          </v-list>
                        </v-col>

                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions class="pb-6">
                    <v-btn color="error"
                           :loading="loading"
                           @click="removeClient(form._id)"
                           v-show="isEditing">
                      Delete Client
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn :loading="loading"
                           @click="dialog = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn color="primary"
                           class="white--text"
                           :loading="loading"
                           @click="addClient(form._id)"
                    >
                      {{ btnText }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small color="primary" class="mx-5" @click="showEditDialog(item)">
              mdi-pencil
            </v-icon>
            <v-icon small color="error" @click="removeClient(item._id)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>

        <v-dialog v-model="editProviderDialog" persistent max-width="350px">
          <v-card>
            <v-card-title>
              <span class="headline">Edit Provider</span>
            </v-card-title>

            <v-card-text class="row">
              <v-col cols="12">
                <v-text-field
                        v-model="providersForm.name"
                        label="Name"
                        outlined
                ></v-text-field>
              </v-col>
            </v-card-text>
            <v-card-actions class="pb-6">
              <v-spacer></v-spacer>
              <v-btn :loading="loading"
                     @click="closeProviderDialog"
              >
                Close
              </v-btn>
              <v-btn :loading="loading"
                     color="primary"
                     @click="updateProvider(providersForm._id)"
              >
                Update
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ClientDataService from './services/ClientDataService'
import ProviderDataService from './services/ProviderDataService'

export default {
  name: 'App',

  mounted(){
    this.getAllClients()
  },

  data(){
    return{
      loading: false,
      dialog: null,
      editProviderDialog: null,
      headers:[
        {
          text: 'Name',
          value: 'name',
          sortable: true
        },
        {
          text: 'Email',
          value: 'email',
          sortable: false
        },
        {
          text: 'Phone',
          value: 'phone',
          sortable: false
        },
        {
          text: 'Providers',
          value: 'providers',
          sortable: false
        },
        {
          text: 'Actions',
          value: 'actions',
          align: 'center',
          sortable: false
        },
      ],
      isEditing: false,
      dataSet: [],
      providers: [],
      providersGroup: [],
      providersForm:{
        _id:'',
        name:''
      },
      form:{
        _id:'',
        name:'',
        email:'',
        phone:'',
        providers: []
      }
    }
  },

  methods:{
    showAddDialog(){
      this.isEditing = false
      this.dialog = true
      this.form ={
        name:'',
        email:'',
        phone:'',
        providers: []
      }
      this.getProviders()
    },
    getProviders(){
      ProviderDataService.getAll().then(response=>{
        this.providers = response.data
      }).catch(e=>{
        console.log(e)
      })
    },
    showEditDialog(client){
      this.isEditing = true
      this.dialog = true
      this.form = client
      console.log(client)
      this.providersGroup = client.providers
    },
    getAllClients(){
      this.loading = true
      ClientDataService.getAll().then(response=>{
        this.loading = false
        this.dataSet = response.data
      }).catch(e=>{
        this.loading = false
        console.log(e)
      })
    },
    addClient(id){
      this.loading = true
      if(!this.isEditing){
        ClientDataService.create(this.form).then(_=>{
          window.location.reload()
        }).catch(e =>{
          this.loading = false
          console.log(e)
        })
      }else{
        ClientDataService.update(id, this.form).then(_=>{
          window.location.reload()
        }).catch(e =>{
          this.loading = false
          console.log(e)
        })
      }

    },
    removeClient(id){
      this.loading = true
      ClientDataService.delete(id).then(_=>{
        window.location.reload()
      }).catch(e=>{
        this.loading = false
        console.log(e)
      })
    },

    addProvider(){
      this.loading = true
      ProviderDataService.create(this.providersForm).then(_ =>{
        this.loading = false
        this.providersForm.name = ''
      }).catch(e=>{
        this.loading = false
        console.log(e)
      })
    },
    editProvider(provider){
      this.editProviderDialog = true
      this.providersForm = provider
      console.log(event, this.form.providers)
    },
    updateProvider(id){
      ProviderDataService.update(id, this.providersForm).then(_=>{
        this.editProviderDialog = false
      }).catch(e=>{
        console.log(e)
      })
    },
    removeProvider(id){
      this.loading = true
      ProviderDataService.delete(id).then(_=>{
        window.location.reload()
      }).catch(e=>{
        this.loading = false
        console.log(e)
      })
    },
    toggleSelectedProviders(index,status, id){
      console.log(status)
      if(!status){
        console.log('add')
        this.form.providers.push(id)
      }else{
        console.log('remove')
        this.form.providers.splice(index, 1)
      }
      console.log(this.form.providers)
    },
    closeProviderDialog(){
      this.editProviderDialog = false
      this.providersForm = {
        _id:'',
        name:''
      }
    }
  },

  computed: {
    formTitle(){
      return this.isEditing  ? `Edit Client` : `Add Client`
    },
    btnText () {
      return this.isEditing  ? 'Save' : 'Add'
    },

  },
};
</script>

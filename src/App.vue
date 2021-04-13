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
                        <v-col cols="7">
                          <v-text-field
                                  v-model="providersForm.name"
                                  label="Providers"
                                  outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="5">
                          <v-btn color="primary" @click="addProvider" x-large>Add Provider</v-btn>
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
                           @click=""
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
      providersForm:{
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
    addClient(){
      this.loading = true
      ClientDataService.create(this.form).then(_=>{
        window.location.reload()
      }).catch(e =>{
        this.loading = false
        console.log(e)
      })
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
        this.providers.push(this.providersForm)
        this.providersForm.name = ''
      }).catch(e=>{
        this.loading = false
        console.log(e)
      })
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
